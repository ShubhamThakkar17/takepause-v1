import type { Variants } from "motion/react";

/** Shared viewport trigger: fire once, a little after the element edges in. */
export const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const;

/** Child variant for anything wrapped in `RevealGroup`. */
export const revealChild: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(5px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
  },
};
