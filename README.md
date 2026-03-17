# top-agent (Oracle-v2 + OpenClaw inspired)

Multi-agent AI workspace for Paul (PM) and Neo (Coder). Goal: go from 0→100 with persistent memory, Git-backed history, and reproducible rituals (/awaken, /rrr).

## Quickstart
1) Prereqs: Ubuntu, Bun ≥1.2, Node 22+, git (SSH). Clone: `git@github.com:aditepDev/top-agent.git`.
2) Install deps: `bun install` (uses Bun for scripts/tests).
3) Read order: `CLAUDE.md` → `SOUL.md` (Paul) → `agents/neo/SOUL.md` → `USER.md` / `AGENTS.md`.
4) Memory: use `ψ/memory/traces/`, `ψ/memory/retrospectives/`, `ψ/inbox/`.
5) Board: GitHub Issues is the canonical task board; comment "Implementation Started" when beginning.
6) Commits: small, descriptive; keep history (Nothing is Deleted); default branch `main`.

## Scripts
- **Awaken agent:** `bun run scripts/awaken.ts --name "Neo" --role coder --vibe "direct, technical" --emoji 🤖` (adds SOUL + trace; commit optional via `--no-commit`).
- **Hybrid search (FTS5 + optional Chroma):** `bun run scripts/hybrid.ts --config mcp/config.example.json --index --skip-chroma` then `--query "error code"`. Enable Chroma by configuring `mcp/config.example.json` + running a Chroma server.

## Phases (from plan)
- **0–20% Foundations:** runtime (Bun), private repo, constitution (CLAUDE.md), memory layout (ψ/).
- **21–40% Identity:** agent roles/personas; awakening ritual (birth commit per agent).
- **41–60% Memory/Tools:** MCP connectors; hybrid search (SQLite FTS5 + ChromaDB); handoff schemas.
- **61–80% Coordination:** GitHub Issues board, typed JSON handoffs.
- **81–100% Governance:** guardrails (recursion/token limits), retrospectives (/rrr), least privilege.

## Artifacts added
- `CLAUDE.md` (constitution/principles/roles/guardrails)
- `agents/neo/SOUL.md` (coder persona)
- `schemas/handoff.schema.json` + `templates/handoff.example.json`
- `/rrr` template: `templates/rrr.md`
- MCP/Hybrid scaffold: `mcp/README.md`, `mcp/config.example.json`, `scripts/hybrid.ts`
- Awaken ritual: `scripts/awaken.ts`
- Tooling: `package.json`, `tsconfig.json`, `eslint.config.js`

## Next Steps
- Provide GitHub token if you want me to create Issues for the board.
- Wire an embedder + Chroma endpoint for semantic search; run ingestion over ψ/ + agents/.
- Flesh out /awaken defaults per agent type; add automated /rrr writer.
- Add lint/test rules specific to your preferred style (e.g., prettier config tweaks) and CI.
