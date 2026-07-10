"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  className?: string;
}

const MotionLink = motion.create(Link);

/** CTA that leans gently toward the pointer. Max travel 6px — physical, not gimmicky. */
export function MagneticButton({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 26 });
  const sy = useSpring(y, { stiffness: 300, damping: 26 });

  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 12);
    y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 10);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "inline-flex items-center gap-2 rounded-[0.625rem] px-5 py-3 text-[0.9375rem] font-medium transition-colors duration-200";
  const styles =
    variant === "primary"
      ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-ink)]"
      : "border border-[var(--line)] bg-[var(--term-bg)] text-[var(--ink)] hover:border-[var(--ink-faint)]";

  return (
    <MotionLink
      ref={ref}
      href={href}
      data-magnetic
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`${base} ${styles} ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </MotionLink>
  );
}
