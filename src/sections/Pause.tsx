import { motion } from "motion/react";
import { Float, Parallax, Reveal, SplitWords } from "@/components/Motion";
import { ease } from "@/lib/motion";
import { pause } from "@/config/copy";

export function Pause() {
  return (
    <section
      aria-labelledby="pause-title"
      className="section scallop-top overflow-hidden bg-rose [--scallop:var(--color-cream)]"
    >
      <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <div className="relative mx-auto w-full max-w-[26rem] lg:order-2 lg:max-w-[30rem]">
          <motion.div
            initial={{ opacity: 0, rotate: 4, y: 60 }}
            whileInView={{ opacity: 1, rotate: 0, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease }}
          >
            <Parallax distance={40}>
              <div className="group overflow-hidden rounded-[2rem] border border-cocoa/15 bg-cream">
                <img
                  src={pause.image.src}
                  alt={pause.image.alt}
                  width={pause.image.width}
                  height={pause.image.height}
                  loading="lazy"
                  className="block w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </div>
            </Parallax>
          </motion.div>
          <Float
            className="absolute -top-5 -right-2 sm:-right-6"
            y={8}
            rotate={6}
            duration={4}
          >
            <p
              className="rotate-6 rounded-full bg-butter px-5 py-2 font-script text-[1.5rem] text-cherry shadow-[0_10px_24px_-14px_rgba(56,35,30,0.6)]"
              aria-hidden="true"
            >
              take a pause
            </p>
          </Float>
        </div>

        <div className="lg:order-1">
          <Reveal y={16}>
            <p className="eyebrow">{pause.eyebrow}</p>
          </Reveal>
          <h2 id="pause-title" className="display-lg mt-4 max-w-[14ch]">
            <SplitWords text={pause.title} />
          </h2>
          <Reveal delay={0.2}>
            <p className="lede mt-6 max-w-[34rem] text-cocoa">{pause.body}</p>
          </Reveal>

          <ul className="mt-10 grid gap-6 sm:grid-cols-3 lg:gap-5">
            {pause.moments.map((m, i) => (
              <motion.li
                key={m.title}
                className="group relative flex gap-4 pt-4 sm:block"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease, delay: i * 0.12 }}
              >
                {/* The rule draws itself in from the left. */}
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left bg-cocoa/80"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.12 }}
                />
                <img
                  src={m.image}
                  alt=""
                  width={120}
                  height={90}
                  className="h-16 w-auto shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1 group-hover:-rotate-6 group-hover:scale-110 sm:h-20"
                />
                <div>
                  <h3 className="font-display text-[1.3rem] leading-snug sm:mt-3">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-[0.95rem] text-cocoa-soft">
                    {m.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
