import { motion, useScroll, useSpring } from "motion/react";

/** A hairline that fills as the page is read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-60 h-px origin-left bg-blush"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
