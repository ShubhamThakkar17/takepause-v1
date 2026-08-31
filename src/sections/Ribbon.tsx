import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from "motion/react";
import { ribbon } from "@/content/site";

/** Wraps a value into [min, max) so the strip can loop forever. */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * A ribbon of brand lines that always drifts, but leans into whichever
 * direction you are scrolling — the page and the type move together.
 */
export function Ribbon() {
  const reduced = useReducedMotion();

  const baseX = useMotionValue(0);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 46, stiffness: 380 });
  const factor = useTransform(smooth, [-1600, 0, 1600], [-4, 0, 4], { clamp: false });

  // Two identical copies are rendered, so wrapping over -50%…0% is seamless.
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;

    const boost = factor.get();
    if (boost < 0) direction.current = -1;
    else if (boost > 0) direction.current = 1;

    const seconds = delta / 1000;
    // 1.6%/s of base drift, plus a kick proportional to scroll velocity.
    baseX.set(baseX.get() + direction.current * 1.6 * seconds * (1 + Math.abs(boost)));
  });

  return (
    <div className="relative overflow-hidden border-y border-line bg-shell py-6">
      <motion.div className="flex w-max flex-nowrap" style={reduced ? undefined : { x }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {ribbon.map((word, i) => (
              <span key={`${copy}-${i}`} className="flex items-center whitespace-nowrap">
                <span className="font-display text-[clamp(1.1rem,2.4vw,1.9rem)] font-light text-ink-soft italic">
                  {word}
                </span>
                <span className="mx-6 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blush sm:mx-9" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
