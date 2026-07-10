"use client";

import { Terminal } from "@/components/terminal/Terminal";
import { CopyCommand } from "@/components/ui/CopyCommand";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { installCtaScript } from "@/data/tools";
import { GITHUB_URL, TAP, TAP_URL } from "@/data/site";

export function InstallCTA() {
  return (
    <section className="section">
      <div className="container-site">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Reveal>
            <h2 className="text-h1">Install one in five seconds.</h2>
          </Reveal>

          <Reveal className="mt-10 w-full" delay={0.1}>
            <Terminal
              script={installCtaScript}
              autoPlay="inView"
              size="md"
              ariaLabel="Terminal demo: brew install suraj7974/tap/pips-cli installs the pips command"
            />
            <div className="mt-3">
              <CopyCommand command="brew install suraj7974/tap/pips-cli" />
            </div>
          </Reveal>

          <Reveal className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton href="/tools">Browse all tools →</MagneticButton>
            <MagneticButton href={GITHUB_URL} variant="ghost" external>
              GitHub ↗
            </MagneticButton>
          </Reveal>

          <Reveal className="mt-7">
            <p className="text-body text-sm">
              Every tool ships from one Homebrew tap:{" "}
              <a
                href={TAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent font-mono"
              >
                {TAP}
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
