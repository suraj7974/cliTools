"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Scramble } from "@/components/ui/Scramble";
import { comingSoon } from "@/data/tools";
import { GITHUB_URL } from "@/data/site";

export function ComingSoon() {
  return (
    <section className="section hairline-t hairline-b bg-[var(--paper-2)]">
      <div className="container-site">
        <Reveal>
          <p className="text-caption">Roadmap</p>
          <h2 className="text-h1 mt-4">On the workbench.</h2>
          <p className="text-body-lg mt-4 max-w-lg">
            Planned tools. One job each — as always.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-x-10 gap-y-5 md:grid-cols-2">
          {comingSoon.map((item, i) => (
            <div
              key={item.command}
              className="group flex items-baseline justify-between gap-4 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-[var(--line)] hover:bg-[var(--term-bg)]"
            >
              <div className="min-w-0 font-mono text-[0.875rem] leading-relaxed">
                <span className="term__prompt">❯ </span>
                <Scramble
                  text={item.command}
                  className="text-[var(--ink-soft)] transition-colors group-hover:text-[var(--ink)]"
                  delay={i * 50}
                  stagger={10}
                />
                <span className="block truncate pl-5 text-[var(--term-comment)] sm:inline sm:pl-0">
                  {"  "}# {item.description}
                </span>
              </div>
              <span className="chip chip--soon shrink-0">soon</span>
            </div>
          ))}
        </div>

        <Reveal className="mt-10">
          <p className="text-body">
            Ideas?{" "}
            <a
              href={`${GITHUB_URL}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              Open an issue on GitHub.
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
