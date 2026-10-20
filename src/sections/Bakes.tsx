import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "@/components/Icons";
import { BakeImageFrame } from "@/components/BakeImageFrame";
import { Float, Reveal, SplitWords } from "@/components/Motion";
import { ease, rise, stagger } from "@/lib/motion";
import { bakesSection } from "@/config/copy";
import {
  addOnPrice,
  bakes,
  cakeBuilder,
  filters,
  priceFor,
  type Bake,
  type FilterId,
} from "@/config/menu";
import { policies } from "@/config/site";
import { useEnquiry } from "@/lib/enquiryContext";
import { arrowNudge, buttonPrimary, buttonSecondary } from "@/lib/ui";

const tints = ["bg-rose-soft", "bg-butter/55", "bg-cream-deep"];

export function Bakes() {
  const [active, setActive] = useState<FilterId | "all">("all");
  const shows = (id: FilterId) => active === "all" || active === id;

  const featured = bakes.filter(
    (b) =>
      ["cheesecakes", "cookies", "brownies"].includes(b.filter) &&
      shows(b.filter),
  );
  const cake = bakes.find((b) => b.id === "cake")!;
  const cupcakes = bakes.find((b) => b.id === "cupcakes")!;
  const extras = bakes.filter((b) => b.filter === "extras" && shows("extras"));
  const count = featured.length + (shows("cakes") ? 2 : 0) + extras.length;

  return (
    <section
      id="bakes"
      aria-labelledby="bakes-title"
      className="section bg-cream"
    >
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Reveal y={16}>
              <p className="eyebrow">{bakesSection.eyebrow}</p>
            </Reveal>
            <h2 id="bakes-title" className="display-lg mt-4">
              <SplitWords text={bakesSection.title} />
            </h2>
          </div>
          <Reveal delay={0.15} className="lg:justify-self-end">
            <p className="lede max-w-[34rem]">{bakesSection.body}</p>
          </Reveal>
        </div>

        <motion.div
          className="mt-10 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter bakes"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={stagger}
        >
          {filters.map((f) => {
            const pressed = active === f.id;
            return (
              <motion.button
                key={f.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => setActive(f.id)}
                variants={rise}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative min-h-11 rounded-full border px-5 text-[0.95rem] font-medium transition-colors duration-300 ${
                  pressed
                    ? "border-cocoa text-cream"
                    : "border-cocoa/25 bg-white/60 text-cocoa hover:border-cocoa"
                }`}
              >
                {/* The dark pill slides from one filter to the next. */}
                {pressed && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-[-1px] rounded-full bg-cocoa"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{f.label}</span>
              </motion.button>
            );
          })}
        </motion.div>
        <p className="sr-only" aria-live="polite">
          Showing {count} {count === 1 ? "bake" : "bakes"}
        </p>

        {featured.length > 0 && (
          <ul className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {featured.map((bake, i) => (
                <motion.li
                  key={bake.id}
                  layout
                  initial={{ opacity: 0, y: 48 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.92,
                    transition: { duration: 0.25 },
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, ease, delay: i * 0.1 }}
                  className={
                    // An odd last card spans the row on two-column screens.
                    i === featured.length - 1 && featured.length % 2 === 1
                      ? "md:col-span-2 lg:col-span-1"
                      : undefined
                  }
                >
                  <BakeCard
                    bake={bake}
                    tint={tints[i % tints.length]}
                    wide={
                      i === featured.length - 1 && featured.length % 2 === 1
                    }
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        <AnimatePresence initial={false}>
          {shows("cakes") && (
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24, transition: { duration: 0.25 } }}
              transition={{ duration: 0.7, ease }}
            >
              <CakeBuilder cake={cake} cupcakes={cupcakes} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {extras.length > 0 && (
            <motion.div
              key="extras"
              className="mt-16"
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24, transition: { duration: 0.25 } }}
              transition={{ duration: 0.7, ease }}
            >
              <h3 className="text-[1.75rem] md:text-[2rem]">
                <SplitWords text="Tubs, boxes and specials" />
              </h3>
              <motion.ul
                className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={stagger}
              >
                {extras.map((bake, i) => (
                  <motion.li key={bake.id} variants={rise}>
                    <ExtraCard
                      bake={bake}
                      tint={tints[(i + 1) % tints.length]}
                    />
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-14 max-w-[46rem] border-t border-cocoa/15 pt-6 text-[0.95rem] text-cocoa-soft">
          Prices are starting points and depend on size, flavour and design.{" "}
          {policies.leadTime}
        </p>
      </div>
    </section>
  );
}

function BakeCard({
  bake,
  tint,
  wide = false,
}: {
  bake: Bake;
  tint: string;
  /** Sits image-beside-text while it spans two columns. */
  wide?: boolean;
}) {
  const openEnquiry = useEnquiry();
  const price = priceFor(bake);

  return (
    <article
      className={`group flex h-full flex-col ${wide ? "md:grid md:grid-cols-2 md:items-start md:gap-x-6 lg:flex" : ""}`}
    >
      <BakeImageFrame image={bake.image} tint={tint} />
      <div className="flex flex-1 flex-col">
        <div
          className={`mt-5 flex items-baseline justify-between gap-4 ${wide ? "md:mt-0 lg:mt-5" : ""}`}
        >
          <h3 className="text-[1.9rem]">{bake.name}</h3>
          <p className="shrink-0 text-[0.9rem] text-cocoa-soft">{bake.size}</p>
        </div>
        {price && <p className="mt-1 font-semibold text-cherry">{price}</p>}
        <p className="mt-3 text-cocoa-soft">{bake.blurb}</p>

        <h4 className="sr-only">Flavours</h4>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {bake.flavours.map((f) => (
            <li
              key={f.name}
              className="rounded-full border border-cocoa/15 bg-white/70 px-3 py-1 text-[0.85rem] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-rose-soft"
            >
              {f.name}
            </li>
          ))}
        </ul>

        {bake.addOns && (
          <p className="mt-4 text-[0.92rem] text-cocoa-soft">
            <span className="font-semibold text-cocoa">
              {bake.addOns.label}
            </span>{" "}
            ({addOnPrice(bake.addOns.items)}):{" "}
            {bake.addOns.items.map((t) => t.name).join(", ")}
          </p>
        )}

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={() => openEnquiry({ bakeId: bake.id })}
            className="group inline-flex min-h-11 items-center gap-2 font-semibold text-cherry"
          >
            <span className="underline decoration-cherry/40 decoration-2 underline-offset-4 group-hover:decoration-cherry">
              Enquire about {bake.name.toLowerCase()}
            </span>
            <ArrowRight width={18} height={18} className={arrowNudge} />
          </button>
        </div>
      </div>
    </article>
  );
}

function CakeBuilder({ cake, cupcakes }: { cake: Bake; cupcakes: Bake }) {
  const openEnquiry = useEnquiry();
  const steps = [
    { label: "Sponge", items: cakeBuilder.sponges },
    { label: "Filling", items: cakeBuilder.fillings },
    { label: "Frosting", items: cakeBuilder.frostings },
  ];

  return (
    <article
      aria-labelledby="builder-title"
      className="mt-16 overflow-hidden rounded-[2rem] border border-cocoa/15 bg-rose-soft"
    >
      <div
        className="checker checker-slide [--checker-color:var(--color-cherry)] [--checker-size:10px] opacity-90"
        aria-hidden="true"
      />
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:p-12">
        <div className="flex flex-col">
          <p className="font-script text-[1.9rem] leading-none text-cherry">
            make your own
          </p>
          <h3 id="builder-title" className="mt-2 text-[2.4rem] md:text-[3rem]">
            Cakes &amp; cupcakes
          </h3>
          <p className="mt-4 text-cocoa-soft">
            Choose a sponge, a filling and a frosting — we'll bake it to order.{" "}
            {policies.customisation}
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-4">
            {[cake, cupcakes].map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-cocoa/15 bg-cream p-4"
              >
                <dt className="font-display text-[1.35rem]">
                  {b.id === "cake" ? "Cake" : "Cupcakes"}
                </dt>
                <dd className="text-[0.9rem] text-cocoa-soft">{b.size}</dd>
                <dd className="mt-1 font-semibold text-cherry">
                  {priceFor(b)}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-auto lg:pt-8">
            <button
              type="button"
              onClick={() => openEnquiry({ bakeId: "cake" })}
              className={buttonPrimary}
            >
              Enquire about a cake
            </button>
            <button
              type="button"
              onClick={() => openEnquiry({ bakeId: "cupcakes" })}
              className={buttonSecondary}
            >
              Cupcakes
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="group overflow-hidden rounded-2xl border border-cocoa/15 bg-cream sm:row-span-3">
            <Float y={8} duration={5} className="h-full">
              <img
                src={cake.image.src}
                alt={cake.image.alt}
                width={600}
                height={450}
                loading="lazy"
                className="w-full object-contain transition-transform duration-700 group-hover:scale-105 sm:aspect-[4/5] sm:h-full"
              />
            </Float>
          </div>
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease, delay: i * 0.15 }}
            >
              <h4 className="flex items-center gap-3 font-display text-[1.35rem]">
                <motion.span
                  className="inline-flex size-8 items-center justify-center rounded-full bg-cherry font-sans text-[0.9rem] font-semibold text-cream"
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 14,
                    delay: 0.2 + i * 0.15,
                  }}
                >
                  {i + 1}
                </motion.span>
                {step.label}
              </h4>
              <p className="mt-2 text-[0.95rem] text-cocoa-soft">
                {step.items.join(" · ")}
              </p>
            </motion.div>
          ))}
          <p className="text-[0.9rem] text-cocoa-soft italic sm:col-start-2">
            {cakeBuilder.note}
          </p>
        </div>
      </div>
    </article>
  );
}

function ExtraCard({ bake, tint }: { bake: Bake; tint: string }) {
  const openEnquiry = useEnquiry();
  const price = priceFor(bake);

  return (
    <article className="group flex h-full gap-4 rounded-2xl border border-cocoa/15 bg-white/50 p-4 transition-[transform,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:bg-white/80 hover:shadow-[0_18px_40px_-24px_rgba(56,35,30,0.5)]">
      <BakeImageFrame
        image={bake.image}
        tint={tint}
        className="w-28 shrink-0 self-start sm:w-32"
        ratio="square"
      />
      <div className="flex min-w-0 flex-col">
        <h4 className="font-display text-[1.4rem] leading-tight">
          {bake.name}
        </h4>
        <p className="text-[0.88rem] text-cocoa-soft">{bake.size}</p>
        {price && (
          <p className="mt-1 text-[0.95rem] font-semibold text-cherry">
            {price}
          </p>
        )}
        <p className="mt-2 text-[0.92rem] text-cocoa-soft">{bake.blurb}</p>
        <button
          type="button"
          onClick={() => openEnquiry({ bakeId: bake.id })}
          className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-2 text-[0.95rem] font-semibold text-cherry underline decoration-cherry/40 decoration-2 underline-offset-4 hover:decoration-cherry"
        >
          Enquire{" "}
          <span className="sr-only">about {bake.name.toLowerCase()}</span>
        </button>
      </div>
    </article>
  );
}
