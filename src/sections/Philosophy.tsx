import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import { philosophy } from "@/content/site";
import { Reveal, RevealLines } from "@/components/Reveal";

/**
 * The still centre of the page. The paragraph is lit word by word as you
 * scroll through it, which forces the reading pace down to the brand's.
 */
export function Philosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "end 0.45"],
  });

  const words = philosophy.body.split(" ");

  return (
    <section className="u-grain relative bg-cream py-(--spacing-section)">
      <div className="u-shell-narrow text-center">
        <Reveal>
          <p className="u-eyebrow">{philosophy.eyebrow}</p>
        </Reveal>

        <h2 className="mt-8 flex flex-wrap items-baseline justify-center gap-x-5 text-[clamp(2.6rem,8vw,6rem)]">
          {philosophy.title.map((word, i) => (
            <RevealLines
              key={word}
              lines={[word]}
              delay={i * 0.14}
              // The script face is the brand mark's own hand — u-display would
              // override it, so the accent word opts out of that utility.
              lineClassName={
                i === 2
                  ? "font-script leading-[1.15] text-blush"
                  : "u-display"
              }
            />
          ))}
        </h2>

        <div ref={ref} className="mt-14">
          <p className="flex flex-wrap justify-center font-display text-[clamp(1.35rem,3.2vw,2.1rem)] leading-[1.5] font-light">
            {words.map((word, i) => (
              <Word
                key={`${word}-${i}`}
                progress={scrollYProgress}
                range={[
                  (i / words.length) * 0.86,
                  (i / words.length) * 0.86 + 0.14,
                ]}
                reduced={reduced ?? false}
              >
                {word}
              </Word>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  reduced,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);

  return (
    <span className="mr-[0.28em] inline-block">
      <motion.span style={reduced ? undefined : { opacity }} className="text-ink">
        {children}
      </motion.span>
    </span>
  );
}
