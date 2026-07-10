# pips

Ghost-text package suggestions for `pip` / `npm` / `pnpm` / `yarn`. As you type
an install command, your shell shows the most-popular matching package as dim
inline text — press `→` to accept.

```
$ pip install num‸numpy       ← ghost text; → to fill, Enter to run
$ npm install expr‸ess
$ pnpm add lod‸ash
```

## Setup

Requires [`zsh-autosuggestions`](https://github.com/zsh-users/zsh-autosuggestions)
(the plugin that renders the ghost text — ships with oh-my-zsh).

Install (the crate is `pips-cli`; the command is `pips`):

```bash
brew install suraj7974/tap/pips-cli   # or: cargo install pips-cli
```

Then enable the shell hook:

```bash
pips update                    # download the package lists (once)
pips init zsh >> ~/.zshrc      # install the shell hook
exec zsh                       # reload your shell
```

Now typing `pip install num`, `npm install expr`, `pnpm add lod`, or `yarn add …`
shows a ghost suggestion.

## Commands

| Command | What it does |
|---------|--------------|
| `pips install [-y] <partial>` | Resolve the partial to the top package and run `pip install` (confirms first; `-y` skips) |
| `pips best [-r pypi\|npm] <partial>` | Print the single top match (used by the shell hook) |
| `pips list [-r pypi\|npm] [-n N] <partial>` | Print the top N matches |
| `pips update` | Refresh the cached package lists |
| `pips init zsh` | Print the shell hook |

## How it works

- Neither registry has a good live *prefix*-search API, so `pips update`
  downloads popularity-ranked package lists and flattens them (one name per line)
  into your OS cache dir (`~/Library/Caches/pips/` on macOS):
  - **PyPI** — the [top-pypi-packages](https://github.com/hugovk/top-pypi-packages) dataset.
  - **npm** — the [npm-high-impact](https://github.com/wooorm/npm-high-impact) download-ranked list (also serves pnpm & yarn — same registry).
- Lookups are a fast prefix scan, so the hook stays snappy on every keystroke.
  Prefix matches rank above substring matches; within each, more-popular
  packages come first.
- The **zsh hook** is a `zsh-autosuggestions` custom strategy that fires on
  `pip|pip3|pips install`, `npm install|i|add`, `pnpm add|install|i`, and
  `yarn add` lines; everything else falls through to your normal history
  suggestions.

> npm ranking is by raw downloads, so infrastructure packages can win a short
> prefix (`rea` → `readable-stream`); one more character narrows it (`reac` →
> `react-is`).

## Ideas to extend

- A Tab-completion fallback for shells without zsh-autosuggestions.
- Fuzzy (typo-tolerant) matching.
- `pips install` for npm/pnpm/yarn too (currently pip only).
