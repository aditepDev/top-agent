# MCP Connectors & Hybrid Search

## Goals
- Provide MCP access to local knowledge (ψ/*, agents/*, docs).
- Hybrid search: SQLite FTS5 (exact) + ChromaDB (semantic) for retrieval.

## Connectors (plan)
- **filesystem**: expose `ψ/` and `agents/` for reading traces, retrospectives, SOULs.
- **sqlite**: local `data/index.sqlite` with FTS5 table `documents` (path, content, updated_at).
- **chroma**: collection `top-agent` at `http://localhost:8000` (or your endpoint) for embeddings.

## Config
- See `mcp/config.example.json` and adjust paths/endpoints.
- Run `bun install` to fetch dependencies (`better-sqlite3`, `chromadb`).
- Start Chroma server separately (e.g., `docker run -p 8000:8000 ghcr.io/chroma-core/chroma:latest`).

## Ingestion / Hybrid search (skeleton)
- Script: `scripts/hybrid.ts`
  - Ensures FTS5 table exists.
  - Upserts documents from configured globs.
  - If embeddings provided (TODO: plug in your embedder), upserts to Chroma.
  - Search combines FTS ranks + Chroma similarity (union of ids with scores).

## TODO
- Wire an embedder (e.g., OpenAI/Anthropic) and pass vectors into `HybridSearch.upsert`.
- Add MCP config to your agent runtime to expose SQLite + Chroma endpoints.
- Add scheduled ingestion over ψ/ + agents/.
