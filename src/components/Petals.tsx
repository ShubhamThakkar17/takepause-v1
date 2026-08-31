import { motion, useReducedMotion } from "motion/react";

const PETALS = [
  { left: "8%", size: 18, delay: 0, drift: 34, duration: 17, rotate: 24 },
  { left: "21%", size: 11, delay: 3.4, drift: -26, duration: 21, rotate: -40 },
  { left: "37%", size: 14, delay: 7.1, drift: 42, duration: 19, rotate: 60 },
  { left: "56%", size: 9, delay: 1.8, drift: -18, duration: 23, rotate: -25 },
  { left: "72%", size: 16, delay: 5.6, drift: 30, duration: 18, rotate: 45 },
  { left: "88%", size: 12, delay: 9.2, drift: -36, duration: 22, rotate: -55 },
];

/**
 * Petals drifting down the hero. Slow, sparse and behind everything —
 * atmosphere, not decoration you have to look at.
 */
export function Petals() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PETALS.map((p, i) => (
        <motion.span
          key={i}
          className="absolute top-0 block rounded-[50%_50%_50%_10%] bg-blush-soft/70"
          style={{ left: p.left, width: p.size, height: p.size * 1.35 }}
          initial={{ y: "-15vh", opacity: 0 }}
          animate={{
            y: ["-15vh", "115vh"],
            x: [0, p.drift, 0, -p.drift * 0.6, 0],
            rotate: [0, p.rotate, p.rotate * 2],
            opacity: [0, 0.75, 0.75, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.15, 0.85, 1],
          }}
        />
      ))}
    </div>
  );
}
