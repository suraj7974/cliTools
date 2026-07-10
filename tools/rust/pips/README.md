# pips

Ghost-text package suggestions for `pip install`. As you type, your shell shows
the most-popular matching package as dim inline text — press `→` to accept.

```
$ pip install num‸numpy       ← "numpy" is ghost text; → to fill, Enter to run
```

## Setup

Requires [`zsh-autosuggestions`](https://github.com/zsh-users/zsh-autosuggestions)
(the plugin that renders the ghost text — ships with oh-my-zsh).

```bash
pips update                    # download the package list (once)
pips init zsh >> ~/.zshrc      # install the shell hook
exec zsh                       # reload your shell
```

Now type `pip install num` in any prompt and `numpy` appears as ghost text.

## Commands

| Command | What it does |
|---------|--------------|
| `pips best <partial>` | Print the single top match (used by the shell hook) |
| `pips list [-n N] <partial>` | Print the top N matches |
| `pips list -r npm <partial>` | Live npm search (manual use) |
| `pips update` | Refresh the cached PyPI package list |
| `pips init zsh` | Print the shell hook |

## How it works

- **PyPI** has no live search API, so `pips update` downloads a popularity-ranked
  list of the most-used packages and flattens it to one name per line in your OS
  cache dir (`~/Library/Caches/pips/` on macOS). Lookups are a fast prefix scan,
  so the hook stays snappy on every keystroke. Prefix matches rank above
  substring matches; within each, more-popular packages come first.
- The **zsh hook** is a `zsh-autosuggestions` custom strategy that only fires on
  `pip install` / `pip3 install` lines; everything else falls through to your
  normal history suggestions.
- **npm** mode uses npm's live search API (for `pips list -r npm`, not the hook).

## Ideas to extend

- Ghost text for `npm install` too (needs a cached top-npm list).
- A Tab-completion fallback for shells without zsh-autosuggestions.
- Fuzzy (typo-tolerant) matching.
