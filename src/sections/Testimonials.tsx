import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { testimonials } from "@/content/site";
import { Reveal, RevealLines } from "@/components/Reveal";
import { Flower } from "@/components/Flower";

const DWELL = 6000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(
      () => setIndex((i) => (i + 1) % testimonials.items.length),
      DWELL,
    );
    return () => clearTimeout(t);
  }, [index, paused]);

  const current = testimonials.items[index];

  return (
    <section
      className="u-grain relative overflow-hidden bg-shell py-(--spacing-section)"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Flower
        id="quote"
        withStem={false}
        detail={false}
        className="pointer-events-none absolute -bottom-[14%] -left-[12%] w-[min(60vw,32rem)] opacity-25"
      />

      <div className="u-shell-narrow relative text-center">
        <Reveal>
          <p className="u-eyebrow">{testimonials.eyebrow}</p>
        </Reveal>
        <h2 className="u-display mt-6 text-[clamp(1.8rem,4.2vw,3.2rem)]">
          <RevealLines lines={[testimonials.title]} />
        </h2>

        <div className="relative mt-14 flex min-h-[15rem] items-center justify-center sm:min-h-[13rem]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 22, filter: "blur(7px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(7px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0"
            >
              <p className="font-display text-[clamp(1.35rem,3.6vw,2.35rem)] leading-[1.45] font-light text-ink italic">
                “{current.quote}”
              </p>
              <footer className="u-eyebrow mt-8">{current.name}</footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-2.5">
          {testimonials.items.map((item, i) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Read what ${item.name} said`}
              aria-current={i === index}
              className="group p-2"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  i === index ? "w-8 bg-ink" : "w-1.5 bg-ink/25 group-hover:bg-ink/50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
