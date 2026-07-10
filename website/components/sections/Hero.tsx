"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal } from "@/components/terminal/Terminal";
import { Scramble } from "@/components/ui/Scramble";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { heroScript } from "@/data/tools";
import { GITHUB_URL } from "@/data/site";

const settle = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const [cueHidden, setCueHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 40) setCueHidden(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative overflow-hidden pb-24 pt-40 sm:pt-44">
      {/* faint dotted grid + soft accent radial behind the terminal */}
      <div
        aria-hidden="true"
        className="dot-grid pointer-events-none absolute inset-0 opacity-60"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[55%] h-[32rem] w-[46rem] -translate-x-1/2 rounded-full opacity-[0.07]"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--accent), transparent 65%)",
        }}
      />

      <div className="container-site relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.p
            className="text-caption !text-[var(--accent-ink)]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: settle }}
          >
            A growing collection · Go + Rust
          </motion.p>

          <Scramble
            as="h1"
            text="Small, fast tools that each do one thing well."
            className="text-display mt-6"
            play="mount"
            delay={150}
            stagger={14}
          />

          <motion.p
            className="text-body-lg mt-6 max-w-xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: settle }}
          >
            Command-line tools built in Go and Rust. A monorepo — install only
            the one you need, no shared runtime.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: settle }}
          >
            <MagneticButton href="/tools">Explore the tools →</MagneticButton>
            <MagneticButton href={GITHUB_URL} variant="ghost" external>
              View on GitHub
            </MagneticButton>
          </motion.div>

          <motion.div
            className="mt-14 w-full max-w-2xl"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6, ease: settle }}
          >
            <Terminal
              script={heroScript}
              autoPlay="inView"
              size="lg"
              ariaLabel="Terminal demo: typing pip install num shows numpy as a ghost-text suggestion; press right arrow to accept. Also works with npm, pnpm and yarn."
            />
            <p className="mt-4 font-mono text-[0.8125rem] text-[var(--ink-faint)]">
              ↳ ghost-text suggestions, powered by{" "}
              <Link href="/tools#pips" className="link-accent">
                pips
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[var(--ink-faint)]"
        animate={
          cueHidden ? { opacity: 0 } : { opacity: [0.4, 0.9, 0.4], y: [0, 6, 0] }
        }
        transition={
          cueHidden
            ? { duration: 0.3 }
            : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </section>
  );
}
