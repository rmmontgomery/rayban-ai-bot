# Project notes for Claude

## Skills and plugins hardcoded for this repository

`.claude/settings.json` registers these plugins. Claude Code installs and
enables them for every session opened on this repository:

| Plugin | Source | Use here |
|---|---|---|
| superpowers | github.com/obra/superpowers | Planning, test-first development, debugging, code review |
| impeccable | github.com/pbakaus/impeccable | Polished interface design (`/impeccable polish`, `audit`, `critique`) |
| claude-mem | github.com/thedotmack/claude-mem | Memory carried from one session to the next |

These are enabled on the account through the claude.ai plugin directory, not
this file, because their source repositories are not public:

- **Jev**, **OpenJev**, **building-with-typesafe-jev**: typed Choice / Score /
  Noul decisions with calibrated probabilities. Used to classify each chapter
  section (derivation, physics simulation, narration, AI video, timeline) and
  rate its difficulty. Needs a TypeSafe API key (or an OpenRouter key).
- **claude-memory**: structured memory.
- **Task Observer**: turns corrections into rules in this file.
- **AI Skills**: includes `find-skills`.
