"use client";

import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap } from "@/lib/gsap";

interface ScrambleProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  play?: "mount" | "inView";
  delay?: number;
  /** per-character duration in ms */
  charDuration?: number;
  stagger?: number;
}

/**
 * Smooth per-character text reveal: each character eases from a soft,
 * slightly blurred state into place, cascading left to right.
 * Server renders the final text (SEO, no CLS); animation is client-only.
 */
export function Scramble({
  text,
  as: Tag = "span",
  className = "",
  play = "inView",
  delay = 0,
  charDuration = 600,
  stagger = 18,
}: ScrambleProps) {
  const ref = useRef<HTMLElement | null>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: SplitType | null = null;
    let ctx: gsap.Context | null = null;

    const run = () => {
      if (done.current || !el) return;
      done.current = true;
      split = new SplitType(el, { types: "chars" });
      const chars = split.chars ?? [];
      ctx = gsap.context(() => {
        gsap.fromTo(
          chars,
          { opacity: 0, filter: "blur(6px)", y: 6 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: charDuration / 1000,
            delay: delay / 1000,
            ease: "power2.out",
            stagger: stagger / 1000,
            clearProps: "filter,transform",
          },
        );
      }, el);
    };

    if (play === "mount") {
      run();
      return () => {
        ctx?.revert();
        split?.revert();
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      ctx?.revert();
      split?.revert();
    };
  }, [play, delay, charDuration, stagger]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} aria-label={text}>
      {text}
    </Tag>
  );
}
