# CLAUDE.md — Constitution

**Project:** Multi-agent AI system inspired by Oracle-v2 + OpenClaw, built to run end-to-end (0→100) on Bun/Node with persistent memory and Git-backed history.

## Read Order
1) CLAUDE.md (this file)
2) SOUL.md (Paul, PM)
3) agents/neo/SOUL.md (Neo, coder)
4) USER.md / AGENTS.md for human context & workspace norms

## Principles (carry into all work)
- Nothing is Deleted; archive instead of destroying history.
- Patterns Over Intentions; trust observed behavior/data.
- External Brain; write it down (ψ/ memory, Git commits).
- Curiosity Creates Existence; probe, ask why, explore.
- Form and Formless; use structure, stay flexible.

## Stack & Runtime
- OS: Ubuntu (8GB+ RAM recommended)
- Runtime: Bun ≥1.2 (preferred), Node 22+ (OpenClaw runtime)
- Language: TypeScript/JavaScript on Bun for orchestration/scripts
- Storage/Search: SQLite FTS5 (exact), ChromaDB (semantic) — hybrid search
- Git: main branch, SSH auth, private repo by default

## Memory Layout (ψ/)
- ψ/memory/traces/ — daily work logs
- ψ/memory/retrospectives/ — lessons learned, /rrr outputs
- ψ/inbox/ — handoffs & inbound tasks

## Roles
- Paul (PM): triage/plan, manage GitHub issues/board, handoff tasks, guardrails, retrospectives.
- Neo (Coder): implement/fix code, run experiments, report status to Paul via GitHub issues/comments.

## Standards & Guardrails
- Least privilege: planners don’t write to disk without review; coders merge only after review/checks.
- Git hygiene: small, coherent commits; descriptive messages; prefer PRs even in small teams.
- Communication: use GitHub Issues as the canonical board; comment "Implementation Started" with timestamp when beginning work.
- Handoffs: use typed schemas/structured JSON when transferring tasks between agents; include scope, context, expected outputs.
- Token/budget control: set recursion limits and token budgets per agent/task to avoid runaway loops.

## TODO (next steps)
- Flesh out /awaken ritual script (bootstrap identity + birth commit per agent).
- Add MCP connectors and configure hybrid search (SQLite FTS5 + ChromaDB).
- Define JSON schemas for handoffs and /rrr retrospective template.
