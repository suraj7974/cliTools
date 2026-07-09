# Feasible CLI Tools — Worth Actually Building

The subset of ideas that are **genuinely useful day-to-day**, clearly buildable end-to-end, and would earn a spot in your `PATH` (not just a fun weekend novelty). Curated out of `CLI Tool Ideas for Beginners.md`.

Rough build order goes easy → involved. Each still teaches the core CLI skills (arg parsing, config storage, subprocess, formatted output).

---

## 🛠️ Dev Workflow (highest real payoff)

- **`envcheck`** — Compares your local `.env` against `.env.example` and flags missing/extra keys before you run the project. Tiny, but saves real onboarding pain. *Teaches: file parsing, set diffing, exit codes.*
- **`todoscan`** — Scans a codebase for `TODO`/`FIXME` comments into a sortable list (by age via `git blame`, by file, by keyword). *Teaches: text search + git metadata.*
- **`branchname`** — Turns a plain-English description into a git branch name — `branchname "fix login bug"` → `fix/login-bug`. No AI needed. *Teaches: string slugification.*
- **`pipsuggest` / `pkgsuggest`** *(your idea)* — Autocompletes/suggests package names as you type (`pip install num` → `numpy`). Query the PyPI/npm search API (or a cached top-packages list) and fuzzy-match. Ship as a shell completion hook. *Teaches: API querying, fuzzy matching, shell completion integration.*

## 🖥️ System Utilities

- **`killport`** — Takes a port and kills whatever process holds it (`killport 3000`). The one everyone reaches for. *Teaches: OS detection, subprocess (`lsof`/`netstat`).*
- **`quietport`** — Inverse of a port scanner: tells you which of your usual ports (3000, 5432, 8080…) are currently **free**. *Teaches: socket binding checks.*
- **`whereami`** — Disk usage, OS, shell, installed dev-tool versions at a glance (mini `neofetch`). *Teaches: OS detection, subprocess, formatted output.*
- **`dupefind`** — Finds duplicate files by hashing content, not filenames. *Teaches: file I/O, hashing, grouping.*
- **`unclutter`** — Organizes a messy folder into subfolders by type/date (mini Hazel). *Teaches: file I/O, rule-based sorting, dry-run design.*

## 🌐 Networking

- **`pingdash`** — Pings a list of hosts/URLs and shows a live terminal status dashboard. *Teaches: async, HTTP/ICMP, live redraw.*

## 🗒️ Productivity & Life-Admin

- **`envswitch`** — Save and swap sets of environment variables per project (generic `nvm`-style). *Teaches: config files, state persistence.*
- **`sincelog`** — `sincelog set "quit sugar"` then any run shows "14 days since…". Simple and satisfying. *Teaches: persistent timestamp tracking.*
- **`billwatch`** — Log recurring subscriptions once (`billwatch add netflix 15 monthly`); shows what's due soon and your monthly/yearly burn. *Teaches: date math, recurring-schedule logic.*
- **`splitup`** — Terminal bill-splitter with uneven splits and tips; prints a clean who-owes-what table. *Teaches: structured math, table output.*
- **`readlater-cli`** — Terminal read-later list: add URLs, mark read, `readlater-cli surprise-me` for a random pick. *Teaches: list/queue management.*
- **`packlist`** — Packing checklist from trip length + destination climate (weather API) + trip type. *Teaches: combining API data with rules.*

## 📖 Text

- **`readtime`** — Estimates reading time for any text/markdown file, flags long sentences, gives a readability score. *Teaches: text parsing, Flesch-style heuristics from scratch.*

## 🧠 Meta (analyze your own shell)

- **`aliasfinder`** — Scans shell history for long repeated commands and suggests aliases, optionally appending to `.bashrc`/`.zshrc`. *Teaches: frequency analysis, safe file mutation.*
- **`clihistory`** — Your most-used commands, most mistyped (consecutive similar entries), time-of-day usage patterns. *Teaches: history parsing, pattern detection.*

---

*Pick one, build it end-to-end **including packaging** (`npm i -g` / `pip install` / `brew`), then move up the list.*
