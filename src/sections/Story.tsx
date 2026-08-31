import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { story } from "@/content/site";
import { Reveal, RevealLines, RevealGroup } from "@/components/Reveal";
import { revealChild } from "@/lib/motion";

export function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Image travels slower than the page; a quiet depth cue.
  const imageY = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.02, 1.12]);

  return (
    <section id="story" className="u-grain relative bg-cream py-(--spacing-section)">
      <div className="u-shell grid items-center gap-14 lg:grid-cols-[0.92fr_1fr] lg:gap-24">
        <div ref={ref} className="relative">
          <div className="relative aspect-4/5 overflow-hidden rounded-t-[999px] bg-shell">
            <motion.img
              src={story.image}
              alt={story.imageAlt}
              loading="lazy"
              className="h-full w-full object-cover"
              style={reduced ? undefined : { y: imageY, scale: imageScale }}
            />
          </div>

          {/* Founder's line, set off the corner of the frame. */}
          <Reveal delay={0.25}>
            <p className="mt-6 font-display text-lg text-ink-soft italic lg:absolute lg:-right-10 lg:bottom-10 lg:mt-0 lg:max-w-[13rem] lg:rounded-sm lg:bg-cream/90 lg:px-6 lg:py-5 lg:backdrop-blur">
              {story.signature}
            </p>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <p className="u-eyebrow">{story.eyebrow}</p>
          </Reveal>

          <h2 className="u-display mt-7 text-[clamp(2.2rem,5.2vw,4.4rem)]">
            <RevealLines lines={["Good things are worth", "slowing down for."]} />
          </h2>

          {story.body.map((paragraph, i) => (
            <Reveal key={i} delay={0.18 + i * 0.1}>
              <p className="u-body mt-8 max-w-[46ch]">{paragraph}</p>
            </Reveal>
          ))}

          <RevealGroup className="mt-14 grid grid-cols-3 gap-6 border-t border-line pt-9">
            {story.stats.map((stat) => (
              <motion.div key={stat.label} variants={revealChild}>
                <p className="font-display text-[clamp(1.5rem,3vw,2.35rem)] leading-none text-ink">
                  {stat.value}
                </p>
                <p className="mt-2.5 font-sans text-[0.7rem] leading-relaxed tracking-[0.13em] text-muted uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
