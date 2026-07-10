"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Scramble } from "@/components/ui/Scramble";
import { GITHUB_URL, TAP_URL } from "@/data/site";

const FACTS = [
  {
    title: "single-binary",
    body: "Every tool compiles to one native executable. No runtime, no interpreter, no dependency tree.",
  },
  {
    title: "cross-platform",
    body: "Built for macOS (Apple Silicon + Intel), Linux, and Windows on every release.",
  },
  {
    title: "instant-startup",
    body: "Native Rust and Go. The tool is done before an interpreter would have booted.",
  },
  {
    title: "released-by-ci",
    body: "A git tag triggers the pipeline: binaries, installers, and the Homebrew formula ship themselves.",
  },
  {
    title: "one-tap",
    body: "A single Homebrew tap serves the whole collection — add it once, install any tool.",
    href: TAP_URL,
    linkLabel: "suraj7974/homebrew-tap",
  },
  {
    title: "mit-licensed",
    body: "All source lives in one monorepo, open under MIT. Read it, fork it, ship your own.",
    href: GITHUB_URL,
    linkLabel: "View the source",
  },
];

export function Craft() {
  return (
    <section className="section hairline-t hairline-b bg-[var(--paper-2)]">
      <div className="container-site">
        <Reveal>
          <p className="text-caption">Under the hood</p>
          <h2 className="text-h1 mt-4">Built like real tools.</h2>
          <p className="text-body-lg mt-4 max-w-lg">
            The same engineering standards as the CLIs you already trust —
            just smaller.
          </p>
        </Reveal>

        <Reveal stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FACTS.map((f, i) => (
            <div key={f.title} className="card p-6">
              <h3 className="font-mono text-[0.9375rem] font-semibold text-[var(--ink)]">
                <span className="term__prompt">❯ </span>
                <Scramble
                  text={f.title}
                  mode="decode"
                  delay={i * 60}
                  stagger={12}
                />
              </h3>
              <p className="text-body mt-3 text-[0.9375rem]">{f.body}</p>
              {f.href ? (
                <p className="mt-3">
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-accent font-mono text-[0.8125rem]"
                  >
                    {f.linkLabel} ↗
                  </a>
                </p>
              ) : null}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
