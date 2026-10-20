/**
 * The site's motion vocabulary, kept in one place so every section moves the
 * same way: things rise gently into place as you scroll, images drift a
 * little slower than the page, and a few small details float.
 *
 * <MotionConfig reducedMotion="user"> in App turns movement off for anyone
 * who asks their device for less motion; the looping pieces below also check
 * for it themselves.
 */
import { useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { ease } from "@/lib/motion";

/** Fades and lifts its children into place the first time they're seen. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.85, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Splits a heading into words that slide up from behind a mask. The words are
 * hidden from assistive tech; the full text is read once, as written.
 */
export function SplitWords({
  text,
  className = "",
  delay = 0,
  onMount = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  /** Animate straight away (the hero) rather than when scrolled into view. */
  onMount?: boolean;
}) {
  const words = text.split(" ");
  const trigger = onMount
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, amount: 0.6 } };

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        {...trigger}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.07, delayChildren: delay } },
        }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
          >
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "110%", rotate: 4 },
                show: {
                  y: "0%",
                  rotate: 0,
                  transition: { duration: 0.9, ease },
                },
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/** Moves its content against the scroll, so it seems to sit deeper. */
export function Parallax({
  children,
  className,
  distance = 60,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [distance, -distance],
  );

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

/** A gentle, endless bob — for stickers and little decorations. */
export function Float({
  children,
  className,
  y = 10,
  rotate = 0,
  duration = 5,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  rotate?: number;
  duration?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      animate={
        reduce
          ? undefined
          : { y: [0, -y, 0], rotate: [-rotate, rotate, -rotate] }
      }
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A ribbon of words that scrolls on its own and speeds up — or reverses —
 * with the page's scroll.
 */
export function Marquee({
  children,
  speed = 40,
  direction = 1,
  className = "",
}: {
  children: ReactNode;
  /** Pixels per second at rest. */
  speed?: number;
  direction?: 1 | -1;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const track = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), {
    damping: 50,
    stiffness: 400,
  });
  const boost = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], {
    clamp: false,
  });
  const heading = useRef(direction);

  useAnimationFrame((_, delta) => {
    if (reduce || !track.current) return;
    const b = boost.get();
    if (b < -0.2) heading.current = -direction as 1 | -1;
    else if (b > 0.2) heading.current = direction;
    const half = track.current.scrollWidth / 2;
    let next =
      x.get() - heading.current * speed * (1 + Math.abs(b)) * (delta / 1000);
    // Loop seamlessly: the track holds two identical copies.
    if (next <= -half) next += half;
    if (next > 0) next -= half;
    x.set(next);
  });

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div ref={track} className="flex w-max" style={{ x }}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/** A thin cherry line along the top that fills as you read down the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-cherry"
      style={{ scaleX }}
    />
  );
}
