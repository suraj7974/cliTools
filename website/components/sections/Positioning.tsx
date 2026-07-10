"use client";

import { useEffect, useRef } from "react";
import Balancer from "react-wrap-balancer";
import { Reveal } from "@/components/ui/Reveal";
import { gsap } from "@/lib/gsap";

const PRINCIPLES = [
  {
    title: "Single-purpose",
    body: "Each tool does exactly one job. No flags you'll never use, no kitchen sink.",
  },
  {
    title: "Fast (Go & Rust)",
    body: "Native binaries, instant startup. Built for the hot path of your day.",
  },
  {
    title: "Install à la carte",
    body: "brew install or cargo install just the one you need. Nothing shared, nothing bloated.",
  },
];

export function Positioning() {
  const underlineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = underlineRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="section bg-[var(--paper-2)] hairline-t hairline-b">
      <div className="container-site">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20">
          <Reveal>
            <h2 className="text-h1">
              <Balancer>One tool. One job. No baggage.</Balancer>
            </h2>
            <span ref={underlineRef} className="accent-underline mt-5" />
            <p className="text-body mt-6">
              A monorepo of small, single-purpose CLIs. Each tool ships on its
              own — <code className="font-mono text-[0.9em]">brew install</code>{" "}
              or <code className="font-mono text-[0.9em]">cargo install</code>{" "}
              just the one you need. Nothing shared, nothing bloated.
            </p>
          </Reveal>
          <Reveal stagger className="grid gap-4 sm:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="card p-6">
                <h3 className="font-mono text-[0.9375rem] font-semibold text-[var(--ink)]">
                  {p.title}
                </h3>
                <p className="text-body mt-3 text-[0.9375rem]">{p.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
