# CLI Tool Ideas — Learning Projects

A collection of simple-but-useful CLI tool ideas for learning how real CLI tools (like `npm`, `gh`) are built — argument parsing, OS detection, subprocess handling, config files, hooks, and more.

---

## 🎯 Starting Idea

- **`openit`** — Opens an image or video file via CLI by detecting the OS and available default viewer (like `xdg-open`/`start`/`open`, but you build it yourself). Teaches OS detection and subprocess spawning.

---

> **Note:** The most practically useful ideas have been moved to **`Feasible CLI Tools.md`**. What remains below leans creative/novelty/learning-focused.

## 🖥️ File & System Utilities
*Teaches: OS detection, subprocess calls, file I/O*

- *(Moved to Feasible: `unclutter`, `dupefind`, `whereami`, `killport`)*

## 🗒️ Productivity Tools
*Teaches: config files, state persistence*

- **`jot`** — Quick terminal notes/journal tool; appends timestamped entries to a local log.
- **`snooze`** — CLI timer/reminder tool that fires a system notification after N minutes.
- *(Moved to Feasible: `envswitch`)*

## 🌐 Networking-Flavored Tools
*Teaches: HTTP calls, async, formatting output*

- **`weathercli`** — Fetches weather from a free API, prints it with colors/ASCII art.
- **`shorten`** — Personal URL shortener talking to a self-hosted or free API.
- *(Moved to Feasible: `pingdash`)*

---

## ✨ Creative / Not-Already-Existing Ideas

### Terminal-as-Canvas
*Teaches: rendering, animation loops*

- **`deskfish`** — A tiny ASCII aquarium in a spare terminal tab; fish react to your CPU usage (busy = frantic, idle = lazy).
- **`typeghost`** — Records your typing rhythm/pauses while writing in a terminal editor, then replays it later like a ghost typing your old entry back at original speed.
- **`commit-weather`** — Parses your git log and renders a "weather report" for the project: stormy (lots of reverts), sunny (clean merges), foggy (long gap since last commit).

### Memory & Reflection Tools
*Teaches: local data stores, retrieval, hooks*

- **`timecapsule`** — Write a note and a "reveal date." Teases you with a countdown until the date, then unlocks the message.
- **`whyid`** — Hooks into `git commit` to silently ask "why did you make this decision?", storing it separately from the commit message as a growing decision log.
- **`echoes`** — Leave a short text note tagged to a directory; anyone who `cd`s into that folder later sees notes past-you left there. Sticky notes for folders.

### Novel Utility Twists
*Teaches: creative data mapping, heuristic design*

- **`soundtrack`** — Analyzes the "mood" of your current directory (file types, activity, commit frequency) and suggests a genre/playlist vibe for coding right now.
- **`apology-generator`** — Detects a `git push --force` and drafts a mad-libs-style Slack apology for your team.
- *(Moved to Feasible: `quietport`)*

---

## 🆕 More Ideas

### Habit & Focus Tools
- **`streakkeeper`** — Tracks a daily habit purely from the terminal (`streakkeeper hit coding`); shows a calendar-heatmap in ASCII, breaks the streak visually if you miss a day. Teaches date-diffing logic and ASCII grid rendering.
- **`focusfence`** — Blocks distracting sites/apps for a set duration by editing `/etc/hosts` (or OS equivalent) temporarily, then auto-reverts. Teaches privileged file editing + scheduled cleanup.
- **`onething`** — Each morning, forces you to set exactly *one* priority task for the day; won't let you add a second until the first is marked done. Teaches enforced state machines in a CLI.

### Terminal Games & Novelty
- **`gitrpg`** — Turns your commit history into an RPG-style stat sheet: commits = XP, files touched = "spells learned," longest streak = "level." Purely cosmetic but fun to build — teaches turning arbitrary data into a scoring/leveling system.
- **`terminull`** — A tiny idle/incremental game that runs in the background of your shell session (via prompt hook) and increments resources every time you open a new terminal tab. Teaches shell prompt hooks (`PROMPT_COMMAND`/`precmd`) and persistent counters.
- **`cli-oracle`** — Ask it a yes/no question, it "consults" your last N shell commands or git log entries and gives a cryptic, semi-relevant answer. Silly, but teaches text sampling/selection logic.

### Dev Workflow Helpers
- *(Moved to Feasible: `branchname`, `todoscan`, `envcheck`)*

### Personal Data Tools
- **`moodline`** — One-word daily mood log (`moodline log tired`) that renders as a simple terminal sparkline over time. Teaches minimal data logging + inline chart rendering.
- *(Moved to Feasible: `sincelog`, `readlater-cli`)*

---

## 🌱 Round 3 — More Ideas

### Sound & Sensory
- **`typebeat`** — Maps different keys/typing speed to subtle terminal beeps or tones, turning fast typing into a rhythm. Teaches basic audio triggering from a CLI (`beep`, terminal bell, or a lightweight audio lib) and mapping input events to output.
- **`silentroom`** — Detects background noise level via your mic for a few seconds and tells you "good time to record" or "too noisy," useful before podcast/video recording. Teaches basic audio input sampling.
- **`colorping`** — Pings a host and represents latency as a color gradient (green → red) printed as terminal blocks over time, so you can *see* network jitter rather than read numbers. Teaches turning numeric data into visual/color output.

### Small Life-Admin Tools
- *(Moved to Feasible: `splitup`, `packlist`, `billwatch`)*

### Text & Writing Tools
- **`voiceprint`** — Analyzes a body of your own past writing (blog posts, notes) and builds a simple "style fingerprint" (avg sentence length, common words, punctuation habits) you can compare new drafts against. Teaches basic text statistics/NLP without needing ML.
- **`ransomize`** — Turns any text into a ransom-note style ASCII art message using random-case/spacing for fun terminal banners. Silly, but teaches ASCII text manipulation and font/spacing tricks.
- *(Moved to Feasible: `readtime`)*

### Meta / Self-Referential Tools
- **`toolusage`** — Tracks how often you use *your own* CLI tools (the ones you build!) and shows a leaderboard — a fun way to see which of your side projects actually get used. Teaches building a shared internal telemetry layer other tools can hook into.
- *(Moved to Feasible: `clihistory`, `aliasfinder`)*

### Location & Context Aware
- **`whereswork`** — Detects which Wi-Fi network you're on and auto-switches a "context" (e.g. work vs home), which other tools/scripts can read to adjust behavior (like auto-toggling a VPN reminder). Teaches network SSID detection and context-file sharing between tools.
- **`sundial`** — Shows sunrise/sunset and "golden hour" times for your current location right in the terminal, handy for photographers. Teaches geolocation (IP-based or manual) + astronomical time calculation.
- **`traffictime`** — You set a usual route once; running it in the morning tells you if today's commute looks worse than average using a free maps/traffic API. Teaches API polling + simple baseline comparison.

---

## 🧠 What These Ideas Teach (Across the Board)

- Argument parsing with subcommands/flags — `argparse`/`click` (Python), `commander`/`yargs` (Node), `cobra` (Go — what `gh` is built with)
- OS-appropriate config storage (`~/.config/toolname/` on Linux/Mac, `%APPDATA%` on Windows)
- Clean `--help` output and proper exit codes
- Colored/formatted terminal output (`chalk`, `rich`, `colorama`)
- Shell hooks and git hooks — a different integration point than plain CLI commands
- Packaging for distribution (`npm install -g`, `pip install`, `brew install`)

---

*Pick one, build it end-to-end (including packaging), then move to the next — that progression is closer to how real tools like `npm` and `gh` actually got built, one deliberate layer at a time.*




---------
My ideas 

pip/npm/etc  auto suggestions, eg: i wrote pip install num then it automatically suggests `numpy`
→ *Promoted to `Feasible CLI Tools.md` as `pipsuggest`/`pkgsuggest`.*

---

## 🆕 Round 4 — Fresh Ideas (useful, not already in this doc)

### Dev-workflow (genuinely handy, buildable)
- **`waitfor`** — Blocks until a host/port/URL is reachable, then exits — `waitfor localhost:5432 && npm start`. The missing glue in Docker/CI startup scripts. *Teaches: socket polling, timeouts, exit codes for scripting.*
- **`secretscan`** — Pre-push scan of your staged diff for accidentally committed API keys/tokens (regex patterns for AWS, Stripe, `.env` leaks). Warns before you push. *Teaches: regex rulesets, git diff parsing, exit-code gating.*
- **`unused`** — Finds dependencies listed in `package.json`/`requirements.txt` that are never imported anywhere in the code. *Teaches: dependency parsing + static import scanning.*
- **`snip`** — Save and recall command/code snippets by name (`snip save deploy "..."`, `snip deploy`). A personal, greppable cheat-sheet in your terminal. *Teaches: keyed local store, clipboard integration.*
- **`gitundo`** — A friendly, safe wrapper over `git reflog` that shows your recent states in plain English and lets you pick one to restore — undo for "oh no" moments. *Teaches: parsing reflog, confirm-before-destructive UX.*

### Files & data
- **`sizehog`** — Instantly shows the biggest files/folders under a path, sorted, human-readable — a friendlier `du`. *Teaches: recursive walk, size aggregation, sorted output.*
- **`bulkrename`** — Pattern/regex batch rename with a **dry-run preview** before applying (`bulkrename 'IMG_(\d+)' 'photo_$1'`). *Teaches: regex capture groups, safe two-phase apply.*
- **`csvpeek`** — View a CSV as an aligned table in the terminal, with per-column type/min/max/null stats. *Teaches: CSV parsing, column inference, table rendering.*
- **`jsonpeek`** — Structural summary of a huge JSON file (key tree, value types, array lengths, depth) without dumping the whole thing. *Teaches: streaming/recursive traversal, schema inference.*
- **`backupnow`** — One command to make a timestamped, compressed backup of a folder to a configured destination, with simple retention (keep last N). *Teaches: archiving, config, cleanup logic.*

### Everyday utility
- **`qrmake`** — Render a QR code right in the terminal for any URL/text — great for `qrmake wifi "SSID" "password"` to let guests join instantly. *Teaches: QR encoding, block/half-block terminal rendering.*
- **`datefmt`** — Convert between timestamp formats and timezones (`datefmt 1700000000 --tz IST`, epoch ↔ ISO ↔ human). *Teaches: date/time math, timezone handling.*
- **`clipstack`** — A clipboard history in the terminal — captures recent copies, lets you re-pick one by number. *Teaches: clipboard access, ring-buffer state, background capture.*
- **`pathcheck`** — Audits your `$PATH` for duplicate entries, missing directories, and binaries shadowed by an earlier entry. *Teaches: PATH parsing, filesystem checks, precedence logic.*
