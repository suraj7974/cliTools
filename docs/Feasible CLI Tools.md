# Feasible CLI Tools — Worth Actually Building

The subset of ideas that are **genuinely useful day-to-day**, clearly buildable end-to-end, and would earn a spot in your `PATH` (not just a fun weekend novelty). Curated out of `CLI Tool Ideas for Beginners.md`.

Rough build order goes easy → involved. Each still teaches the core CLI skills (arg parsing, config storage, subprocess, formatted output).

---

## 🛠️ Dev Workflow (highest real payoff)

- **`unused`** — Finds dependencies listed in `package.json`/`requirements.txt` that are never imported anywhere in the code. *Teaches: dependency parsing + static import scanning.*

- **`pipsuggest` / `pkgsuggest`** *(your idea)* — Autocompletes/suggests package names as you type (`pip install num` → `numpy`). Query the PyPI/npm search API (or a cached top-packages list) and fuzzy-match. Ship as a shell completion hook. *Teaches: API querying, fuzzy matching, shell completion integration.*
- 
- **`waitfor`** — waitfor — Blocks until a service, host, port, URL, or resource becomes ready, then exits. Examples: waitfor localhost:5432, waitfor https://api.example.com, waitfor postgres, waitfor redis, waitfor docker:mysql, waitfor compose, waitfor localhost:5432 localhost:6379 && npm start. Perfect for Docker, Docker Compose, CI/CD, and local development. Teaches: socket polling, HTTP health checks, retries, timeouts, concurrency, service discovery, and shell scripting with exit codes. *Teaches: socket polling, timeouts, exit codes for scripting.*

## 🖥️ System Utilities

- **`dupefind`** — Finds duplicate files by hashing content, not filenames. *Teaches: file I/O, hashing, grouping.*
- **`unclutter`** — Organizes a messy folder into subfolders by type/date (mini Hazel). *Teaches: file I/O, rule-based sorting, dry-run design.*

## 🌐 Networking

- **`pingdash`** — Pings a list of hosts/URLs and shows a live terminal status dashboard. *Teaches: async, HTTP/ICMP, live redraw.*
- - **`weathercli`** — Fetches weather from a free API, prints it with colors/ASCII art.
- **`shorten`** — Personal URL shortener talking to a self-hosted or free API.

### Terminal-as-Canvas
*Teaches: rendering, animation loops*

- **`deskfish`** — A tiny ASCII aquarium in a spare terminal tab; fish react to your CPU usage (busy = frantic, idle = lazy).
- **`typeghost`** — Records your typing rhythm/pauses while writing in a terminal editor, then replays it later like a ghost typing your old entry back at original speed.

### Files & data
- **`bulkrename`** — Pattern/regex batch rename with a **dry-run preview** before applying (`bulkrename 'IMG_(\d+)' 'photo_$1'`). *Teaches: regex capture groups, safe two-phase apply.*


### Everyday utility
- **`qrmake`** — Render a QR code right in the terminal for any URL/text — great for `qrmake wifi "SSID" "password"` to let guests join instantly. *Teaches: QR encoding, block/half-block terminal rendering.*
- **`clipstack`** — A clipboard history in the terminal — captures recent copies, lets you re-pick one by number. *Teaches: clipboard access, ring-buffer state, background capture.*

### Memory & Reflection Tools
*Teaches: local data stores, retrieval, hooks*

- **`echoes`** — Leave a short text note tagged to a directory; anyone who `cd`s into that folder later sees notes past-you left there. Sticky notes for folders.

## 🗒️ Productivity & Life-Admin

- **`snooze`** — CLI timer/reminder tool that fires a system notification after N minutes.
- 
- **`sincelog`** — `sincelog set "quit sugar"` then any run shows "14 days since…". Simple and satisfying. *Teaches: persistent timestamp tracking.*

## 🧠 Meta (analyze your own shell)

- **`clihistory`** — Your most-used commands, most mistyped (consecutive similar entries), time-of-day usage patterns. *Teaches: history parsing, pattern detection.*
- **`toolusage`** — Tracks how often you use *your own* CLI tools (the ones you build!) and shows a leaderboard — a fun way to see which of your side projects actually get used. Teaches building a shared internal telemetry layer other tools can hook into.

### Location & Context Aware
- **`whereswork`** — Detects which Wi-Fi network you're on and auto-switches a "context" (e.g. work vs home), which other tools/scripts can read to adjust behavior (like auto-toggling a VPN reminder). Teaches network SSID detection and context-file sharing between tools.


### Sound & Sensory
- **`typebeat`** — Maps different keys/typing speed to subtle terminal beeps or tones, turning fast typing into a rhythm. Teaches basic audio triggering from a CLI (`beep`, terminal bell, or a lightweight audio lib) and mapping input events to output.
- **`colorping`** — Pings a host and represents latency as a color gradient (green → red) printed as terminal blocks over time, so you can *see* network jitter rather than read numbers. Teaches turning numeric data into visual/color output.


### Terminal Games & Novelty
- **`terminull`** — A tiny idle/incremental game that runs in the background of your shell session (via prompt hook) and increments resources every time you open a new terminal tab. Teaches shell prompt hooks (`PROMPT_COMMAND`/`precmd`) and persistent counters.
---

*Pick one, build it end-to-end **including packaging** (`npm i -g` / `pip install` / `brew`), then move up the list.*
