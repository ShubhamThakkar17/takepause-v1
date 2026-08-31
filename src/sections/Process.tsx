import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { process } from "@/content/site";
import { Reveal, RevealLines } from "@/components/Reveal";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * The four steps. On a wide screen the section pins and the steps travel
 * sideways as you scroll — the page holds still while the process unfolds,
 * which is the whole idea of the brand. Narrow screens get a plain stack.
 */
export function Process() {
  const isWide = useMediaQuery("(min-width: 1024px)");
  const reduced = useReducedMotion();
  const pinned = isWide && !reduced;

  return (
    <section id="process" className="u-grain relative bg-cream">
      <div className="u-shell pt-(--spacing-section) pb-16">
        <Reveal>
          <p className="u-eyebrow">{process.eyebrow}</p>
        </Reveal>
        <div className="mt-6 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <h2 className="u-display text-[clamp(2.2rem,5.6vw,4.8rem)]">
            <RevealLines lines={[process.title]} />
          </h2>
          <Reveal delay={0.18}>
            <p className="u-body max-w-[36ch]">{process.subtitle}</p>
          </Reveal>
        </div>
      </div>

      {pinned ? <PinnedSteps /> : <StackedSteps />}

      <div className="u-shell flex justify-center pt-6 pb-(--spacing-section)">
        <Reveal delay={0.1}>
          <a
            href={process.cta.href}
            className="group relative inline-block overflow-hidden rounded-full bg-ink px-10 py-4 font-sans text-[0.74rem] tracking-[0.22em] text-cream uppercase"
          >
            <span className="relative z-10">{process.cta.label}</span>
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-blush transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function PinnedSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Four panels at half a viewport each: the track is 200% wide, so travelling
  // -50% of its own width moves it by exactly one viewport.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative h-[340vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* shrink-0 matters: as a flex child the track would otherwise be
            squeezed back down to the viewport width. */}
        <motion.div className="flex w-[200%] shrink-0" style={{ x }}>
          {process.steps.map((step) => (
            <article
              key={step.n}
              className="flex w-1/4 shrink-0 items-center px-[5vw]"
            >
              <div className="max-w-[30rem]">
                <span className="font-display text-[clamp(4rem,9vw,9rem)] leading-none text-blush-soft">
                  {step.n}
                </span>
                <h3 className="u-display mt-6 text-[clamp(1.9rem,3.4vw,3rem)]">
                  {step.title}
                </h3>
                <p className="u-body mt-6">{step.body}</p>
              </div>
            </article>
          ))}
        </motion.div>

        <div className="absolute bottom-16 left-[6vw] h-px w-[min(30vw,22rem)] bg-line">
          <motion.span
            className="absolute inset-y-0 left-0 block bg-ink"
            style={{ width: progress }}
          />
        </div>
      </div>
    </div>
  );
}

function StackedSteps() {
  return (
    <ol className="u-shell space-y-px border-t border-line">
      {process.steps.map((step, i) => (
        <motion.li
          key={step.n}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.9, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-line py-9"
        >
          <span className="font-display text-3xl text-blush">{step.n}</span>
          <h3 className="u-display mt-3 text-[clamp(1.6rem,6vw,2.2rem)]">{step.title}</h3>
          <p className="u-body mt-4 max-w-[42ch]">{step.body}</p>
        </motion.li>
      ))}
    </ol>
  );
}
