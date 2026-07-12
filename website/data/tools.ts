import { line, type TerminalScript } from "@/components/terminal/types";
import { GITHUB_URL } from "./site";

/* ------------------------------------------------------------------ */
/* Terminal scripts — every demo on the site is defined here as data. */
/* ------------------------------------------------------------------ */

/** Hero: the ghost-text "aha", looping across package managers. */
export const heroScript: TerminalScript = {
  id: "hero-pips",
  title: "zsh — pips",
  loop: true,
  steps: [
    { kind: "prompt" },
    { kind: "pause", ms: 850 },
    { kind: "type", text: "pip install num" },
    { kind: "ghost", text: "py" },
    { kind: "pause", ms: 700 },
    { kind: "accept" },
    { kind: "pause", ms: 1400 },
    { kind: "clear" },
    { kind: "prompt" },
    { kind: "type", text: "npm install rea" },
    { kind: "ghost", text: "dable-stream" },
    { kind: "pause", ms: 600 },
    { kind: "type", text: "c" },
    { kind: "ghost", text: "t-is" },
    { kind: "pause", ms: 700 },
    { kind: "accept" },
    { kind: "pause", ms: 1300 },
    { kind: "clear" },
    { kind: "prompt" },
    { kind: "type", text: "pnpm add lod" },
    { kind: "ghost", text: "ash" },
    { kind: "pause", ms: 700 },
    { kind: "accept" },
    { kind: "pause", ms: 1600 },
    { kind: "clear" },
  ],
};

/**
 * pips deep-dive: four standalone scenes. Scroll moves between scenes;
 * each scene TYPES ITSELF in real time — playback is never tied to scroll.
 */
export const pipsScenes: TerminalScript[] = [
  {
    id: "pips-scene-ghost",
    title: "— pips —",
    steps: [
      { kind: "prompt" },
      { kind: "pause", ms: 350 },
      { kind: "type", text: "pip install num" },
      { kind: "ghost", text: "py" },
      { kind: "pause", ms: 600 },
      { kind: "accept" },
    ],
  },
  {
    id: "pips-scene-install",
    title: "— pips —",
    steps: [
      { kind: "prompt" },
      { kind: "pause", ms: 350 },
      { kind: "type", text: "pips install num" },
      { kind: "submit" },
      {
        kind: "confirm",
        question: "Install 'numpy' (matched from 'num')? [Y/n]",
        answer: "Y",
      },
      {
        kind: "print",
        lines: [
          line("+ pip install numpy", "comment"),
          line("✓ installed numpy", "green"),
        ],
      },
    ],
  },
  {
    id: "pips-scene-list",
    title: "— pips —",
    steps: [
      { kind: "prompt" },
      { kind: "pause", ms: 350 },
      { kind: "type", text: "pips list num" },
      { kind: "submit" },
      {
        kind: "print",
        lines: [line("numpy"), line("numba"), line("numexpr")],
      },
    ],
  },
  {
    id: "pips-scene-npm",
    title: "— pips —",
    steps: [
      { kind: "prompt" },
      { kind: "pause", ms: 350 },
      { kind: "type", text: "npm install rea" },
      { kind: "ghost", text: "dable-stream" },
      { kind: "pause", ms: 650 },
      { kind: "type", text: "c" },
      { kind: "ghost", text: "t-is" },
      { kind: "pause", ms: 650 },
      { kind: "accept" },
    ],
  },
];

/** sizehog deep-dive: two standalone scenes, real-time playback. */
export const sizehogScenes: TerminalScript[] = [
  {
    id: "sizehog-scene-cwd",
    title: "— sizehog —",
    steps: [
      { kind: "prompt" },
      { kind: "pause", ms: 350 },
      { kind: "type", text: "sizehog ." },
      { kind: "submit" },
      {
        kind: "print",
        lines: [
          line("Top 10 largest files under .:"),
          {
            spans: [
              { text: "   1.5 MB", tone: "cyan" },
              { text: "  ./assets/video.mp4" },
            ],
          },
          {
            spans: [
              { text: " 512.0 KB", tone: "cyan" },
              { text: "  ./data/dump.json" },
            ],
          },
          {
            spans: [
              { text: " 312.4 KB", tone: "cyan" },
              { text: "  ./target/build.log" },
            ],
          },
          {
            spans: [
              { text: " 128.9 KB", tone: "cyan" },
              { text: "  ./notes/roadmap.md" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sizehog-scene-downloads",
    title: "— sizehog —",
    steps: [
      { kind: "prompt" },
      { kind: "pause", ms: 350 },
      { kind: "type", text: "sizehog ~/Downloads" },
      { kind: "submit" },
      {
        kind: "print",
        lines: [
          line("Top 10 largest files under ~/Downloads:"),
          {
            spans: [
              { text: "    4.2 GB", tone: "cyan" },
              { text: "  ~/Downloads/conference-talk.mp4" },
            ],
          },
          {
            spans: [
              { text: "  980.3 MB", tone: "cyan" },
              { text: "  ~/Downloads/dataset.zip" },
            ],
          },
          {
            spans: [
              { text: "  214.7 MB", tone: "cyan" },
              { text: "  ~/Downloads/design-assets.sketch" },
            ],
          },
        ],
      },
    ],
  },
];

/**
 * upwait deep-dive: three standalone scenes, real-time playback.
 */
export const upwaitScenes: TerminalScript[] = [
  {
    id: "upwait-scene-chain",
    title: "— upwait —",
    steps: [
      { kind: "prompt" },
      { kind: "pause", ms: 350 },
      { kind: "type", text: "upwait localhost:5432 && npm start" },
      { kind: "submit" },
      {
        kind: "print",
        lines: [line("waiting for localhost:5432 (timeout 30s)…", "comment")],
      },
      { kind: "pause", ms: 1200 },
      {
        kind: "print",
        lines: [
          line("✓ localhost:5432 is up after 2.3s", "green"),
          line("> app ready on http://localhost:3000"),
        ],
      },
    ],
  },
  {
    id: "upwait-scene-url",
    title: "— upwait —",
    steps: [
      { kind: "prompt" },
      { kind: "pause", ms: 350 },
      { kind: "type", text: "upwait https://api.example.com -t 60" },
      { kind: "submit" },
      {
        kind: "print",
        lines: [
          line("waiting for https://api.example.com (timeout 60s)…", "comment"),
        ],
      },
      { kind: "pause", ms: 1200 },
      {
        kind: "print",
        lines: [line("✓ https://api.example.com is up after 8.4s", "green")],
      },
    ],
  },
  {
    id: "upwait-scene-timeout",
    title: "— upwait —",
    steps: [
      { kind: "prompt" },
      { kind: "pause", ms: 350 },
      {
        kind: "type",
        text: "upwait localhost:6379 -t 5 || echo 'redis never came up'",
      },
      { kind: "submit" },
      {
        kind: "print",
        lines: [line("waiting for localhost:6379 (timeout 5s)…", "comment")],
      },
      { kind: "pause", ms: 1200 },
      {
        kind: "print",
        lines: [
          line("✗ timed out after 5s waiting for localhost:6379", "yellow"),
          line("redis never came up"),
        ],
      },
    ],
  },
];

/** Card thumbnails — short, replayable. */
export const pipsCardScript: TerminalScript = {
  id: "pips-card",
  loop: true,
  steps: [
    { kind: "prompt" },
    { kind: "type", text: "pip install num" },
    { kind: "ghost", text: "py" },
    { kind: "pause", ms: 650 },
    { kind: "accept" },
    { kind: "pause", ms: 1600 },
    { kind: "clear" },
  ],
};

export const upwaitCardScript: TerminalScript = {
  id: "upwait-card",
  loop: true,
  steps: [
    { kind: "prompt" },
    { kind: "type", text: "docker start postgres" },
    { kind: "submit" },
    {
      kind: "print",
      lines: [line("postgres  # container up — db still booting", "comment")],
    },
    { kind: "pause", ms: 500 },
    { kind: "prompt" },
    { kind: "type", text: "upwait localhost:5432 && npm start" },
    { kind: "submit" },
    {
      kind: "print",
      lines: [line("waiting for localhost:5432…", "comment")],
    },
    { kind: "pause", ms: 1300 },
    {
      kind: "print",
      lines: [
        line("✓ localhost:5432 is up after 2.3s", "green"),
        line("> connected to postgres — first try"),
      ],
    },
    { kind: "pause", ms: 2400 },
    { kind: "clear" },
  ],
};

export const sizehogCardScript: TerminalScript = {
  id: "sizehog-card",
  loop: true,
  steps: [
    { kind: "prompt" },
    { kind: "type", text: "sizehog ." },
    { kind: "submit" },
    {
      kind: "print",
      lines: [
        line("Top 10 largest files under .:"),
        {
          spans: [
            { text: "   1.5 MB", tone: "cyan" },
            { text: "  ./assets/video.mp4" },
          ],
        },
        {
          spans: [
            { text: " 512.0 KB", tone: "cyan" },
            { text: "  ./data/dump.json" },
          ],
        },
      ],
    },
    { kind: "pause", ms: 2400 },
    { kind: "clear" },
  ],
};

/** Closing CTA: a real install, typed. */
export const installCtaScript: TerminalScript = {
  id: "install-cta",
  title: "zsh",
  steps: [
    { kind: "prompt" },
    { kind: "type", text: "brew install suraj7974/tap/pips-cli" },
    { kind: "submit" },
    {
      kind: "print",
      lines: [
        line("==> Fetching suraj7974/tap/pips-cli", "comment"),
        line("✓ /opt/homebrew/bin/pips", "green"),
      ],
    },
    { kind: "pause", ms: 400 },
  ],
};

/** Footer sign-off. */
export const footerScript: TerminalScript = {
  id: "footer",
  steps: [
    { kind: "prompt" },
    { kind: "pause", ms: 300 },
    { kind: "type", text: "thanks for scrolling" },
    { kind: "pause", ms: 200 },
  ],
};

/* ------------------------------------------------------------------ */
/* Tool metadata                                                       */
/* ------------------------------------------------------------------ */

export interface InstallOption {
  label: string;
  command: string;
}

export interface HowStep {
  title: string;
  body: string;
}

export interface Tool {
  slug: string;
  name: string;
  version: string;
  lang: "Rust" | "Go";
  tagline: string;
  verdict: string;
  install: InstallOption[];
  note?: string;
  sourceUrl: string;
  /** one standalone script per how-it-works step; each plays in real time */
  scenes: TerminalScript[];
  cardScript: TerminalScript;
  howItWorks: HowStep[];
}

export const tools: Tool[] = [
  {
    slug: "pips",
    name: "pips",
    version: "0.2.0",
    lang: "Rust",
    tagline: "Ghost-text package suggestions for pip / npm / pnpm / yarn.",
    verdict: "Autocomplete for your package managers.",
    install: [
      { label: "brew", command: "brew install suraj7974/tap/pips-cli" },
      { label: "cargo", command: "cargo install pips-cli" },
    ],
    note: "crate: pips-cli · command: pips",
    sourceUrl: `${GITHUB_URL}/tree/main/tools/rust/pips`,
    scenes: pipsScenes,
    cardScript: pipsCardScript,
    howItWorks: [
      {
        title: "Type less",
        body: "As you type, the best match appears as dim ghost text — press → to accept. Works for pip, pip3, npm, pnpm, yarn.",
      },
      {
        title: "Or let pips run it",
        body: "pips install num resolves the partial to the top package, asks once, and runs pip for you.",
      },
      {
        title: "Just browsing?",
        body: "pips list shows the top matches, ranked by popularity.",
      },
      {
        title: "Every manager",
        body: "npm ranks by raw downloads — so rea suggests readable-stream, and one more keystroke narrows reac to react-is.",
      },
    ],
  },
  {
    slug: "upwait",
    name: "upwait",
    version: "0.1.0",
    lang: "Rust",
    tagline: "Block until a port or URL is up.",
    verdict: "sleep waits for a guess; upwait waits for the truth.",
    install: [
      { label: "brew", command: "brew install suraj7974/tap/upwait" },
      { label: "cargo", command: "cargo install upwait" },
    ],
    sourceUrl: `${GITHUB_URL}/tree/main/tools/rust/upwait`,
    scenes: upwaitScenes,
    cardScript: upwaitCardScript,
    howItWorks: [
      {
        title: "The && bridge",
        body: "Servers exiting isn't servers being ready. upwait exits 0 the moment the target actually answers — so the next command in your chain runs at exactly the right time.",
      },
      {
        title: "Ports and URLs",
        body: "Checks a TCP host:port, or GETs an http(s) URL — any response below 500 counts as up. Unresolvable DNS just means \"not up yet\", so containers registering late are fine.",
      },
      {
        title: "Fails loudly",
        body: "If the target never comes up, upwait exits 1 after the timeout — your startup chain stops instead of launching an app that's doomed to crash.",
      },
    ],
  },
  {
    slug: "sizehog",
    name: "sizehog",
    version: "0.1.2",
    lang: "Rust",
    tagline: "Find the biggest files under a directory.",
    verdict: "du sorted the way you actually wanted.",
    install: [
      { label: "brew", command: "brew install suraj7974/tap/sizehog" },
      { label: "cargo", command: "cargo install sizehog" },
    ],
    sourceUrl: `${GITHUB_URL}/tree/main/tools/rust/sizehog`,
    scenes: sizehogScenes,
    cardScript: sizehogCardScript,
    howItWorks: [
      {
        title: "Point it anywhere",
        body: "sizehog walks the whole tree under the path you give it — skipping symlinks so it never loops.",
      },
      {
        title: "Ranked, human-readable",
        body: "Every file is ranked by size and the top 10 print largest-first, in units you can read at a glance.",
      },
    ],
  },
];

