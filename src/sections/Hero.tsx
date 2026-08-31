import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { hero } from "@/content/site";
import { Flower } from "@/components/Flower";
import { Petals } from "@/components/Petals";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The hero sinks and softens as the page moves past it, so the next section
  // feels like it is rising rather than merely following.
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const bloomY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const bloomScale = useTransform(scrollYProgress, [0, 1], [1, 1.28]);

  const style = reduced ? {} : { y: copyY, opacity: copyOpacity };

  return (
    <section
      id="top"
      ref={ref}
      className="u-grain relative flex min-h-[100svh] items-center overflow-hidden bg-cream pt-28 pb-24"
    >
      {/* Oversized bloom, bled off the right edge and drifting on scroll. */}
      <motion.div
        className="pointer-events-none absolute -top-[8%] -right-[18%] w-[min(78vw,50rem)] opacity-45 sm:-right-[10%] lg:right-[-4%] lg:w-[min(46vw,42rem)]"
        style={reduced ? {} : { y: bloomY, scale: bloomScale }}
      >
        <Flower id="hero" withStem={false} detail={false} className="w-full" />
      </motion.div>

      <Petals />

      <motion.div className="u-shell relative" style={style}>
        <motion.p
          className="u-eyebrow"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="u-display mt-6 text-[clamp(2.9rem,8.6vw,8.5rem)]">
          {hero.title.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  delay: 0.25 + i * 0.13,
                  duration: 1.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {i === 1 ? (
                  <>
                    Have Something{" "}
                    <em className="font-script text-blush not-italic">Sweet.</em>
                  </>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="u-body mt-8 max-w-[34ch] text-[1.05rem] sm:max-w-[42ch]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          className="mt-11 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href={hero.primaryCta.href}
            className="group relative overflow-hidden rounded-full bg-ink px-9 py-4 font-sans text-[0.74rem] tracking-[0.22em] text-cream uppercase"
          >
            <span className="relative z-10">{hero.primaryCta.label}</span>
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-blush transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
          </a>
          <a
            href={hero.secondaryCta.href}
            className="group inline-flex items-center gap-2 font-sans text-[0.74rem] tracking-[0.22em] text-ink uppercase"
          >
            {hero.secondaryCta.label}
            <span className="inline-block h-px w-8 bg-ink transition-all duration-500 group-hover:w-12" />
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        style={reduced ? {} : { opacity: copyOpacity }}
      >
        <span className="u-eyebrow text-[0.6rem]">{hero.scrollCue}</span>
        <span className="relative block h-12 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 block h-4 bg-ink/60"
            animate={{ y: [-16, 48] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
