import { motion } from "motion/react";
import { Info } from "@/components/Icons";
import { Reveal, SplitWords } from "@/components/Motion";
import { ease, rise, stagger } from "@/lib/motion";
import { howToOrder } from "@/config/copy";
import { policies } from "@/config/site";
import { useEnquiry } from "@/lib/enquiryContext";
import { buttonOnCherry } from "@/lib/ui";

export function HowToOrder() {
  const openEnquiry = useEnquiry();
  const terms = [
    { label: "Notice", body: policies.leadTime },
    {
      label: "Pickup & delivery",
      body: `${policies.fulfilment} ${policies.pickupNote}`,
    },
    { label: "Confirmation", body: policies.confirmation },
  ];

  return (
    <section
      id="order"
      aria-labelledby="order-title"
      className="section scallop-top bg-rose-soft [--scallop:var(--color-cream)]"
    >
      <div className="shell">
        <Reveal y={16}>
          <p className="eyebrow">{howToOrder.eyebrow}</p>
        </Reveal>
        <h2 id="order-title" className="display-lg mt-4">
          <SplitWords text={howToOrder.title} />
        </h2>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {howToOrder.steps.map((step, i) => (
            <motion.li
              key={step.title}
              className="group"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delayChildren: i * 0.18 }}
            >
              <span className="block overflow-hidden" aria-hidden="true">
                <motion.span
                  className="block origin-bottom-left font-display text-[4.5rem] leading-none text-cherry italic transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:scale-110"
                  variants={{
                    hidden: { y: "100%" },
                    show: {
                      y: "0%",
                      transition: { duration: 0.9, ease, delay: i * 0.18 },
                    },
                  }}
                >
                  {i + 1}
                </motion.span>
              </span>
              <motion.span
                aria-hidden="true"
                className="mt-3 block h-px origin-left bg-cocoa/25"
                variants={{
                  hidden: { scaleX: 0 },
                  show: {
                    scaleX: 1,
                    transition: { duration: 1, ease, delay: 0.2 + i * 0.18 },
                  },
                }}
              />
              <motion.h3
                className="pt-4 text-[1.6rem]"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, delay: 0.35 + i * 0.18 },
                  },
                }}
              >
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </motion.h3>
              <motion.p
                className="mt-2 text-cocoa-soft"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, delay: 0.45 + i * 0.18 },
                  },
                }}
              >
                {step.body}
              </motion.p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <motion.dl
            className="grid gap-px overflow-hidden rounded-[1.5rem] border border-cocoa/15 bg-cocoa/15 sm:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            {terms.map((t) => (
              <motion.div
                key={t.label}
                variants={rise}
                className="bg-cream p-6 transition-colors duration-300 hover:bg-white"
              >
                <dt className="font-semibold text-cherry">{t.label}</dt>
                <dd className="mt-2 text-[0.95rem] text-cocoa-soft">
                  {t.body}
                </dd>
              </motion.div>
            ))}
          </motion.dl>

          <motion.div
            className="flex flex-col justify-between gap-6 rounded-[1.5rem] bg-cherry p-6 text-cream sm:p-8"
            initial={{ opacity: 0, y: 40, rotate: 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
          >
            <p className="flex gap-3">
              <Info className="mt-1 shrink-0" />
              <span className="text-[1.05rem]">{howToOrder.disclaimer}</span>
            </p>
            <button
              type="button"
              onClick={() => openEnquiry()}
              className={buttonOnCherry}
            >
              Start an enquiry
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
