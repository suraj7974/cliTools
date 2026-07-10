"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const EASE_SETTLE = "power3.out";
export const EASE_SETTLE_CSS: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];

export { gsap, ScrollTrigger };
