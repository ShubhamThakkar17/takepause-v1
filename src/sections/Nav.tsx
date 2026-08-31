import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Logo } from "@/components/Logo";
import { nav, contact } from "@/content/site";

export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    // Give the page back to the reader on the way down; return it on the way up.
    setHidden(y > previous && y > 320 && !menuOpen);
  });

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid && !menuOpen
            ? "border-b border-line/70 bg-cream/85 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
        animate={{ y: hidden ? "-105%" : "0%" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="u-shell flex items-center justify-between gap-8 py-4">
          <a href="#top" aria-label="Take A Pause — home" className="shrink-0">
            <Logo size="sm" withTagline={false} />
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group relative font-sans text-[0.8rem] tracking-[0.14em] text-ink-soft uppercase transition-colors hover:text-ink"
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-ink transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={contact.whatsapp.href}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden rounded-full border border-ink px-6 py-2.5 font-sans text-[0.72rem] tracking-[0.2em] text-ink uppercase transition-all duration-500 hover:bg-ink hover:text-cream sm:inline-block"
            >
              Order Now
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <motion.span
                className="block h-px w-6 bg-ink"
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 3 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                className="block h-px w-6 bg-ink"
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -3 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="u-grain fixed inset-0 z-40 flex flex-col justify-center bg-cream lg:hidden"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="u-shell space-y-2">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="u-display block py-2 text-[clamp(2.25rem,10vw,3.5rem)] text-ink"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="u-shell mt-12 flex flex-col gap-2 text-sm text-muted">
              <a href={contact.whatsapp.href} target="_blank" rel="noreferrer noopener">
                {contact.whatsapp.label}
              </a>
              <a href={contact.instagram.href} target="_blank" rel="noreferrer noopener">
                {contact.instagram.label}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
