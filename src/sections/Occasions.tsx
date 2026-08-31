import { motion } from "motion/react";
import { occasions } from "@/content/site";
import { Reveal, RevealLines } from "@/components/Reveal";

export function Occasions() {
  return (
    <section className="u-grain relative overflow-hidden bg-shell py-(--spacing-section)">
      <div className="u-shell text-center">
        <Reveal>
          <p className="u-eyebrow">{occasions.eyebrow}</p>
        </Reveal>
        <h2 className="u-display mt-6 text-[clamp(2.2rem,5.6vw,4.4rem)]">
          <RevealLines lines={[occasions.title]} />
        </h2>

        <ul className="mt-14 flex flex-wrap justify-center gap-3 sm:gap-4">
          {occasions.items.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-block cursor-default rounded-full border border-line bg-cream px-6 py-3 font-display text-[clamp(1rem,2.2vw,1.4rem)] text-ink-soft transition-all duration-500 hover:-translate-y-1 hover:border-blush hover:text-ink sm:px-8 sm:py-3.5">
                {item}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
