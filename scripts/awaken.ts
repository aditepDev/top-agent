#!/usr/bin/env bun
import { Command } from "commander";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const program = new Command();

program
  .description("Awaken a new agent: scaffold SOUL.md + trace, optional birth commit")
  .requiredOption("--name <name>", "Agent display name (e.g., Neo)")
  .option("--role <role>", "Role (e.g., coder, pm)")
  .option("--emoji <emoji>", "Signature emoji", "🤖")
  .option("--vibe <vibe>", "Personality/vibe", "direct, technical")
  .option("--persona <text>", "Long-form description")
  .option("--no-commit", "Skip git commit")
  .option("--dry-run", "Do not write files; show plan only");

program.parse(process.argv);
const options = program.opts();

const slug = options.name
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const agentDir = path.join("agents", slug);
const soulPath = path.join(agentDir, "SOUL.md");
const tracesDir = path.join("ψ", "memory", "traces");
const dateStamp = new Date().toISOString().split("T")[0];
const tracePath = path.join(tracesDir, `${dateStamp}-${slug}-awaken.md`);

if (!options.dryRun && fs.existsSync(soulPath)) {
  console.error(`SOUL already exists: ${soulPath}`);
  process.exit(1);
}

const soulContent = `# ${options.name} — ${options.role ?? "Agent"}

## Role
- ${options.role ?? "Describe role"}
- Follow CLAUDE.md (constitution) + USER.md/AGENTS.md context.

## Personality
- ${options.vibe}
- Emoji: ${options.emoji}

## Guardrails
- Nothing is Deleted; favor reversible changes.
- Ask before external actions with cost/side effects.
- Keep history in ψ/ + Git; handoffs use structured JSON.

## Workflow
- Intake tasks via GitHub Issues (comment \"Implementation Started\" with timestamp).
- Read order: CLAUDE.md → SOUL.md → task context.
- Work in small, coherent commits; document tests + gaps.

## Memory & Handoffs
- Log traces to ψ/memory/traces/.
- Write /rrr retrospectives to ψ/memory/retrospectives/ when tasks finish.
- Handoffs: include task, context, status, next steps, blockers, artifacts.

## Notes
${options.persona ?? ""}
`;

const traceContent = `# Awaken: ${options.name} (${slug})
- When: ${new Date().toISOString()}
- Role: ${options.role ?? ""}
- Vibe: ${options.vibe}
- Emoji: ${options.emoji}
- Created by: ${process.env.USER ?? "unknown"}
- Paths: ${soulPath}, ${tracePath}
`;

if (options.dryRun) {
  console.log("[dry-run] would create:");
  console.log(`  ${soulPath}`);
  console.log(`  ${tracePath}`);
  process.exit(0);
}

fs.mkdirSync(agentDir, { recursive: true });
fs.mkdirSync(tracesDir, { recursive: true });
fs.writeFileSync(soulPath, soulContent.trim() + "\n", "utf8");
fs.writeFileSync(tracePath, traceContent.trim() + "\n", "utf8");

console.log(`Created ${soulPath}`);
console.log(`Created ${tracePath}`);

if (options.commit) {
  try {
    execSync(`git add "${soulPath}" "${tracePath}"`, { stdio: "inherit" });
    execSync(`git commit -m "Awaken ${options.name}"`, { stdio: "inherit" });
    console.log("Birth commit created");
  } catch (err) {
    console.error("Git commit failed. Review status manually.");
    process.exitCode = 1;
  }
}
