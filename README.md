# top-agent (Oracle-v2 + OpenClaw inspired)

Multi-agent AI workspace for Paul (PM) and Neo (Coder). Goal: go from 0→100 with persistent memory, Git-backed history, and reproducible rituals (/awaken, /rrr).

## Quickstart
1) Prereqs: Ubuntu, Bun ≥1.2, Node 22+, git (SSH). Repo: `git@github.com:aditepDev/top-agent.git`.
2) Read order: `CLAUDE.md` → `SOUL.md` (Paul) → `agents/neo/SOUL.md` → `USER.md` / `AGENTS.md`.
3) Memory: use `ψ/memory/traces/`, `ψ/memory/retrospectives/`, `ψ/inbox/`.
4) Board: use GitHub Issues as the canonical task board; comment "Implementation Started" when beginning.
5) Commits: small, descriptive; keep history (Nothing is Deleted); default branch `main`.

## Phases (from plan)
- **0–20% Foundations:** runtime (Bun), private repo, constitution (CLAUDE.md), memory layout (ψ/).
- **21–40% Identity:** agent roles/personas; awakening ritual (birth commit per agent).
- **41–60% Memory/Tools:** MCP connectors; hybrid search (SQLite FTS5 + ChromaDB); handoff schemas.
- **61–80% Coordination:** GitHub Issues board, typed JSON handoffs.
- **81–100% Governance:** guardrails (recursion/token limits), retrospectives (/rrr), least privilege.

## Next Steps
- Implement /awaken ritual script for new agents.
- Add MCP connectors and hybrid search setup.
- Define JSON schemas for handoffs and /rrr retrospectives.
- Add lint/test config (TypeScript on Bun).
