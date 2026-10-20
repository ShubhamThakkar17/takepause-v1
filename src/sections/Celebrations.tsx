import { motion } from "motion/react";
import { Check } from "@/components/Icons";
import { Reveal, SplitWords } from "@/components/Motion";
import { ease, pop, stagger } from "@/lib/motion";
import { celebrations } from "@/config/copy";
import { policies } from "@/config/site";
import { useEnquiry } from "@/lib/enquiryContext";
import { buttonPrimary } from "@/lib/ui";

export function Celebrations() {
  const openEnquiry = useEnquiry();

  return (
    <section
      aria-labelledby="celebrations-title"
      className="section scallop-top bg-cream [--scallop:var(--color-rose)]"
    >
      <div className="shell">
        <motion.div
          className="relative overflow-hidden rounded-[2rem] border border-cocoa/15 bg-butter/45"
          initial={{ opacity: 0, scale: 0.94, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1, ease }}
        >
          <div
            className="stripes stripes-slide h-4 [--stripe-a:var(--color-cherry)] [--stripe-b:var(--color-butter)]"
            aria-hidden="true"
          />
          <div className="grid gap-10 p-6 sm:p-10 md:grid-cols-[1.15fr_0.85fr] md:items-center lg:p-14">
            <div>
              <Reveal y={16}>
                <p className="eyebrow">{celebrations.eyebrow}</p>
              </Reveal>
              <h2
                id="celebrations-title"
                className="display-lg mt-4 max-w-[16ch]"
              >
                <SplitWords text={celebrations.title} />
              </h2>
              <p className="lede mt-6 max-w-[36rem] text-cocoa">
                {celebrations.body}
              </p>
              <button
                type="button"
                onClick={() => openEnquiry({ intent: "celebration" })}
                className={`${buttonPrimary} mt-8 w-full sm:w-auto`}
              >
                {celebrations.cta}
              </button>
            </div>

            <motion.div
              className="rounded-[1.5rem] border border-cocoa/15 bg-cream p-6 transition-transform duration-500 hover:-rotate-1 sm:p-8"
              initial={{ opacity: 0, x: 40, rotate: 3 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease, delay: 0.25 }}
            >
              <h3 className="font-display text-[1.5rem]">How it works</h3>
              <motion.ul
                className="mt-5 space-y-4"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
                variants={{
                  ...stagger,
                  show: {
                    transition: { staggerChildren: 0.18, delayChildren: 0.5 },
                  },
                }}
              >
                {celebrations.points.map((point) => (
                  <motion.li
                    key={point}
                    className="flex gap-3"
                    variants={{
                      hidden: { opacity: 0, x: 16 },
                      show: { opacity: 1, x: 0 },
                    }}
                  >
                    <motion.span
                      variants={pop}
                      className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-pistachio text-cream"
                    >
                      <Check width={14} height={14} strokeWidth={2.4} />
                    </motion.span>
                    <span>{point}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <p className="mt-6 border-t border-cocoa/15 pt-4 text-[0.92rem] text-cocoa-soft">
                {policies.customisation} {policies.leadTime}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
