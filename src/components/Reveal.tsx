import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { VIEWPORT } from "@/lib/motion";

/**
 * The site's one reveal gesture: a short rise out of a blur, on a long
 * decelerating curve. Reused everywhere so the whole page moves in one voice.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span" | "li" | "section" | "figure";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={reduced ? undefined : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}

/** Staggers direct children that use {@link revealChild}. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "section";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Tag>
  );
}

/**
 * Headline treatment: each line is clipped and slides up from below its own
 * baseline, so the type assembles itself rather than simply fading in.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
}: {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={line + i} className="block overflow-hidden pb-[0.12em]">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            initial={reduced ? undefined : { y: "108%", opacity: 0 }}
            whileInView={reduced ? undefined : { y: "0%", opacity: 1 }}
            viewport={VIEWPORT}
            transition={{
              duration: 1.15,
              delay: delay + i * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
