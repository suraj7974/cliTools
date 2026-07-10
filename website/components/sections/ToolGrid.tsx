"use client";

import Link from "next/link";
import { Terminal } from "@/components/terminal/Terminal";
import { CopyCommand } from "@/components/ui/CopyCommand";
import { Reveal } from "@/components/ui/Reveal";
import { tools } from "@/data/tools";

export function ToolGrid() {
  return (
    <section className="section">
      <div className="container-site">
        <Reveal>
          <p className="text-caption">The collection</p>
          <h2 className="text-h1 mt-4">Shipped and installable.</h2>
        </Reveal>

        <Reveal stagger className="mt-12 grid gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <article key={tool.slug} className="card p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-mono text-xl font-semibold text-[var(--ink)]">
                  {tool.name}
                </h3>
                <span className="chip">v{tool.version}</span>
                <span className="chip">{tool.lang}</span>
              </div>
              <p className="text-body mt-2.5">{tool.tagline}</p>

              <div className="mt-5">
                <Terminal
                  script={tool.cardScript}
                  autoPlay="inView"
                  replay
                  size="sm"
                  ariaLabel={`Short demo of ${tool.name}`}
                />
              </div>

              <div className="mt-5 space-y-2">
                {tool.install.map((opt) => (
                  <CopyCommand key={opt.label} command={opt.command} />
                ))}
              </div>

              <p className="mt-5">
                <Link
                  href={`/tools#${tool.slug}`}
                  className="link-accent text-sm font-medium"
                >
                  Review →
                </Link>
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
