import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { menu } from "@/content/site";
import { Reveal, RevealLines } from "@/components/Reveal";

/**
 * The menu reads as an index, not a grid of cards. On a pointer device the
 * hovered row raises its own photograph under the cursor; on touch every row
 * carries a small thumbnail instead.
 */
export function Menu() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { damping: 30, stiffness: 200, mass: 0.6 });
  const y = useSpring(mouseY, { damping: 30, stiffness: 200, mass: 0.6 });

  const track = (event: React.MouseEvent) => {
    const bounds = listRef.current?.getBoundingClientRect();
    if (!bounds) return;
    mouseX.set(event.clientX - bounds.left);
    mouseY.set(event.clientY - bounds.top);
  };

  return (
    <section id="menu" className="u-grain relative bg-shell py-(--spacing-section)">
      <div className="u-shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="u-eyebrow">{menu.eyebrow}</p>
            </Reveal>
            <h2 className="u-display mt-6 text-[clamp(2.2rem,5.6vw,4.8rem)]">
              <RevealLines lines={["Everything,", "made the long way."]} />
            </h2>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-[30ch] font-sans text-sm leading-relaxed text-muted">
              {menu.note}
            </p>
          </Reveal>
        </div>

        <ul
          ref={listRef}
          onMouseMove={track}
          onMouseLeave={() => setActive(null)}
          className="relative mt-16 border-t border-line"
        >
          {menu.items.map((item, i) => (
            <li key={item.name} className="border-b border-line">
              <motion.a
                href="#contact"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.85, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center gap-5 py-7 sm:gap-8 md:py-9"
              >
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="h-16 w-14 shrink-0 rounded-sm object-cover sm:h-20 sm:w-16 md:hidden"
                />

                <span className="hidden w-10 shrink-0 font-sans text-[0.7rem] tracking-[0.18em] text-muted md:block">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={`u-display block text-[clamp(1.5rem,3.9vw,3rem)] transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:translate-x-3 ${
                      active !== null && active !== i ? "md:text-ink/35" : "text-ink"
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="u-body mt-1.5 block max-w-[46ch] text-[0.9rem] md:mt-2.5 md:text-[0.95rem] md:transition-all md:duration-600 md:ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:translate-x-3">
                    {item.description}
                  </span>
                </span>

                <span className="shrink-0 text-right">
                  <span className="block font-display text-[clamp(1.05rem,2.2vw,1.6rem)] text-ink">
                    {item.price}
                  </span>
                  <span className="mt-0.5 block font-sans text-[0.6rem] tracking-[0.16em] text-muted uppercase">
                    onwards
                  </span>
                </span>
              </motion.a>
            </li>
          ))}

          {/* Cursor-borne preview. Pointer-events off so it never blocks a row. */}
          {!reduced && (
            <motion.div
              className="pointer-events-none absolute top-0 left-0 z-20 hidden h-72 w-56 overflow-hidden rounded-sm md:block"
              style={{ x, y, translateX: "-50%", translateY: "-50%" }}
            >
              <AnimatePresence>
                {active !== null && (
                  <motion.img
                    key={active}
                    src={menu.items[active].image}
                    alt=""
                    initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
                    animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
                    exit={{ opacity: 0, scale: 0.94, rotate: 2 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full w-full object-cover"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </ul>

        <Reveal delay={0.15}>
          <div className="mt-14 flex justify-center">
            <a
              href={menu.cta.href}
              className="group inline-flex items-center gap-3 rounded-full border border-ink px-9 py-4 font-sans text-[0.74rem] tracking-[0.22em] text-ink uppercase transition-colors duration-500 hover:bg-ink hover:text-cream"
            >
              {menu.cta.label}
              <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
