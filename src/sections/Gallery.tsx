import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { gallery } from "@/content/site";
import { Reveal, RevealLines } from "@/components/Reveal";

/**
 * Three columns drifting at different speeds as the section passes. The
 * offsets are what make it feel like depth rather than a grid.
 */
export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const slow = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const fast = useTransform(scrollYProgress, [0, 1], ["14%", "-14%"]);
  const middle = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const columns = [
    { images: gallery.images.slice(0, 3), y: slow, offset: "" },
    { images: gallery.images.slice(3, 6), y: middle, offset: "md:mt-24" },
    { images: gallery.images.slice(6, 9), y: fast, offset: "md:mt-10" },
  ];

  return (
    <section id="gallery" className="u-grain relative overflow-hidden bg-cream py-(--spacing-section)">
      <div className="u-shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="u-eyebrow">{gallery.eyebrow}</p>
            </Reveal>
            <h2 className="u-display mt-6 text-[clamp(2.2rem,5.6vw,4.4rem)]">
              <RevealLines lines={[gallery.title]} />
            </h2>
          </div>
          <Reveal delay={0.2}>
            <a
              href={gallery.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-3 font-sans text-[0.74rem] tracking-[0.2em] text-ink uppercase"
            >
              {gallery.handle}
              <span className="inline-block h-px w-8 bg-ink transition-all duration-500 group-hover:w-12" />
            </a>
          </Reveal>
        </div>

        <div ref={ref} className="mt-16 grid grid-cols-2 items-start gap-3 sm:gap-5 md:grid-cols-3">
          {columns.map((column, ci) => (
            <motion.div
              key={ci}
              // On mobile the two-column grid leaves the third column short, so
              // it lies down across the full width instead of stranding a gap.
              className={`flex flex-col gap-3 sm:gap-5 ${column.offset} ${
                ci === 2 ? "col-span-2 flex-row md:col-span-1 md:flex-col" : ""
              }`}
              style={reduced ? undefined : { y: column.y }}
            >
              {column.images.map((image, ii) => (
                <motion.figure
                  key={image.src}
                  initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{
                    duration: 1,
                    delay: ci * 0.08 + ii * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative min-w-0 flex-1 overflow-hidden rounded-sm bg-shell"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="aspect-4/5 w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                </motion.figure>
              ))}
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 flex justify-center">
            <a
              href={gallery.cta.href}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full border border-ink px-9 py-4 font-sans text-[0.74rem] tracking-[0.22em] text-ink uppercase transition-colors duration-500 hover:bg-ink hover:text-cream"
            >
              {gallery.cta.label}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
