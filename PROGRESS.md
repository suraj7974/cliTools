# Build Progress Tracker

Single source of truth for which tools are done. Flip the status as you go.
Idea backlog: [`docs/Feasible CLI Tools.md`](docs/Feasible%20CLI%20Tools.md) ·
[`docs/CLI Tool Ideas for Beginners.md`](docs/CLI%20Tool%20Ideas%20for%20Beginners.md)

**Legend:** ✅ Done · 🚧 In Progress · ⬜ Planned · 💤 Backlog (not scheduled)

**Count:** 2 done · 0 in progress · 22 planned

---

## 🚀 Active Roadmap

Lang is a *suggestion* (Go = system/logic/network, Rust = file/perf-heavy). Change freely.

### Dev workflow
| Tool | Lang | Status | Notes |
|------|------|--------|-------|
| `envcheck` | Go | ⬜ | Diff `.env` vs `.env.example` |
| `todoscan` | Go | ⬜ | TODO/FIXME scanner + `git blame` age |
| `branchname` | Go | ⬜ | English → `fix/login-bug` |
| `waitfor` | Go | ⬜ | Block until host/port/URL is up |
| `secretscan` | Go | ⬜ | Pre-push scan for leaked keys |
| `unused` | Go | ⬜ | Find unused deps |
| `snip` | Go | ⬜ | Save/recall command snippets |
| `gitundo` | Go | ⬜ | Friendly `git reflog` undo |
| `pipsuggest` | Go | ⬜ | Package-name autosuggest (PyPI/npm) |

### System utilities
| Tool | Lang | Status | Notes |
|------|------|--------|-------|
| `killport` | Go | ✅ | Kill process on a port |
| `quietport` | Go | ⬜ | Which usual ports are free |
| `whereami` | Go | ⬜ | Mini `neofetch` |
| `pathcheck` | Go | ⬜ | Audit `$PATH` |
| `datefmt` | Go | ⬜ | Timestamp/timezone convert |

### Files & data
| Tool | Lang | Status | Notes |
|------|------|--------|-------|
| `sizehog` | Rust | ✅ | Biggest files under a path |
| `dupefind` | Rust | ⬜ | Duplicate files by content hash |
| `bulkrename` | Rust | ⬜ | Regex batch rename + dry-run |
| `unclutter` | Rust | ⬜ | Organize folder by type/date |
| `csvpeek` | Rust | ⬜ | CSV as a table + column stats |
| `jsonpeek` | Rust | ⬜ | Structural summary of big JSON |
| `backupnow` | Rust | ⬜ | Timestamped folder backup |

### Networking & everyday
| Tool | Lang | Status | Notes |
|------|------|--------|-------|
| `pingdash` | Go | ⬜ | Live ping status dashboard |
| `qrmake` | Go | ⬜ | Terminal QR / wifi share |

### Life-admin & personal
| Tool | Lang | Status | Notes |
|------|------|--------|-------|
| `sincelog` | Go | ⬜ | "14 days since…" tracker |
| `billwatch` | Go | ⬜ | Subscription/burn tracker |
| `splitup` | Go | ⬜ | Bill splitter |
| `readlater-cli` | Go | ⬜ | Terminal read-later list |
| `readtime` | Go | ⬜ | Reading time + readability |

---

## 🌐 Website
| Item | Status | Notes |
|------|--------|-------|
| `website/` scaffold | ⬜ | Docs site explaining every tool |
| Per-tool docs in `docs/` | ⬜ | One `.md` per tool for the site to read |

---

## 💤 Backlog (creative / novelty — not scheduled)

Pulled from the idea docs; promote into the roadmap above when you want to build one.

`openit` · `jot` · `snooze` · `weathercli` · `shorten` · `deskfish` · `typeghost` ·
`commit-weather` · `timecapsule` · `whyid` · `echoes` · `soundtrack` ·
`apology-generator` · `streakkeeper` · `focusfence` · `onething` · `gitrpg` ·
`terminull` · `cli-oracle` · `moodline` · `voiceprint` · `ransomize` · `toolusage` ·
`whereswork` · `sundial` · `traffictime` · `typebeat` · `silentroom` · `colorping` ·
`envswitch` · `packlist` · `clihistory` · `aliasfinder` · `clipstack`

---

*When a tool is done: set ✅, update the count at the top, and add its folder under
`tools/go/` or `tools/rust/` + a doc in `docs/`.*
