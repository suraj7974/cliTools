"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** stagger children instead of revealing the wrapper as one block */
  stagger?: boolean;
  /** kept for call-site compatibility; no longer used (no slide) */
  y?: number;
  delay?: number;
}

/**
 * Focus reveal: content settles from a soft out-of-focus state into sharp —
 * opacity + blur + a hair of scale. No boxes sliding around.
 */
export function Reveal({
  children,
  className = "",
  stagger = false,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = stagger ? Array.from(el.children) : [el];
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, filter: "blur(9px)", scale: 0.988 },
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.9,
          delay,
          ease: "power2.out",
          stagger: stagger ? 0.09 : 0,
          clearProps: "filter,transform",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [stagger, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
