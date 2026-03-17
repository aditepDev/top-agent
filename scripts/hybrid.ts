#!/usr/bin/env bun
import { Command } from "commander";
import Database from "better-sqlite3";
import { ChromaClient, type Collection } from "chromadb";
import fs from "node:fs";
import path from "node:path";

interface Config {
  sqlite: { dbPath: string; table: string };
  chroma?: { endpoint?: string; collection?: string; apiKey?: string | null };
  sources: string[];
}

interface Doc {
  id: string;
  text: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

const program = new Command();
program
  .description("Hybrid search scaffold: SQLite FTS5 + optional Chroma")
  .option("--config <path>", "Config JSON", "mcp/config.example.json")
  .option("--query <text>", "Run a search query")
  .option("--limit <n>", "Results per backend", (v) => Number(v), 5)
  .option("--index", "Index sources defined in config")
  .option("--skip-chroma", "Skip Chroma operations", false);

program.parse(process.argv);
const opts = program.opts();

const config: Config = JSON.parse(fs.readFileSync(opts.config, "utf8"));
const db = new Database(config.sqlite.dbPath);

function ensureSchema() {
  db.pragma("journal_mode = WAL");
  db.exec(
    `CREATE VIRTUAL TABLE IF NOT EXISTS ${config.sqlite.table} USING fts5(id, path, content, updated_at, tokenize = 'porter');`
  );
}

function indexDocs(docs: Doc[]) {
  const stmt = db.prepare(
    `INSERT INTO ${config.sqlite.table} (id, path, content, updated_at) VALUES (@id, @path, @content, @updated_at)
     ON CONFLICT(id) DO UPDATE SET content=excluded.content, updated_at=excluded.updated_at, path=excluded.path`
  );
  const tx = db.transaction((rows: Doc[]) => {
    for (const doc of rows) {
      stmt.run({
        id: doc.id,
        path: doc.source ?? doc.id,
        content: doc.text,
        updated_at: new Date().toISOString()
      });
    }
  });
  tx(docs);
}

function searchSqlite(query: string, limit: number) {
  const stmt = db.prepare(
    `SELECT id, path, snippet(${config.sqlite.table}, 2, '<b>', '</b>', '…', 10) AS snippet
     FROM ${config.sqlite.table} WHERE ${config.sqlite.table} MATCH ? LIMIT ?`
  );
  return stmt.all(query, limit);
}

async function getChromaCollection(): Promise<Collection> {
  if (opts.skipChroma || !config.chroma?.endpoint || !config.chroma?.collection) {
    throw new Error("Chroma not configured; use --skip-chroma or fill mcp/config.example.json");
  }
  const client = new ChromaClient({ path: config.chroma.endpoint, apiKey: config.chroma.apiKey ?? undefined });
  return client.getOrCreateCollection({ name: config.chroma.collection });
}

async function indexChroma(docs: Doc[]) {
  if (opts.skipChroma) return;
  if (!config.chroma?.endpoint || !config.chroma?.collection) return;
  const collection = await getChromaCollection();
  await collection.add({
    ids: docs.map((d) => d.id),
    documents: docs.map((d) => d.text),
    metadatas: docs.map((d) => ({ path: d.source ?? d.id, ...(d.metadata ?? {}) }))
  });
}

async function searchChroma(query: string, limit: number) {
  const collection = await getChromaCollection();
  return collection.query({ queryTexts: [query], nResults: limit });
}

async function collectDocs(): Promise<Doc[]> {
  const docs: Doc[] = [];
  for (const pattern of config.sources) {
    const glob = new Bun.Glob(pattern);
    for await (const file of glob.scan(".")) {
      const full = path.join(process.cwd(), file);
      const stat = fs.statSync(full);
      if (!stat.isFile()) continue;
      const text = fs.readFileSync(full, "utf8");
      docs.push({ id: file, text, source: file, metadata: { bytes: stat.size } });
    }
  }
  return docs;
}

async function main() {
  ensureSchema();

  if (opts.index) {
    const docs = await collectDocs();
    indexDocs(docs);
    await indexChroma(docs);
    console.log(`Indexed ${docs.length} docs into SQLite${opts.skipChroma ? "" : " + Chroma"}`);
  }

  if (opts.query) {
    const sqlite = searchSqlite(opts.query, opts.limit);
    console.log("SQLite FTS results:", sqlite);
    if (!opts.skipChroma && config.chroma?.endpoint) {
      const chroma = await searchChroma(opts.query, opts.limit);
      console.log("Chroma results:", chroma);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
