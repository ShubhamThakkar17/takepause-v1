import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { Wordmark } from "@/components/Wordmark";
import { Close, MenuIcon } from "@/components/Icons";
import { nav } from "@/config/site";
import { useEnquiry } from "@/lib/enquiryContext";
import { buttonPrimaryCompact } from "@/lib/ui";

export function Header() {
  const openEnquiry = useEnquiry();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Step out of the way on the way down; come back on the way up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    setHidden(y > previous && y > 280 && !menuOpen);
  });

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => desktop.matches && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [menuOpen]);

  return (
    <motion.header
      className={`sticky top-0 z-40 border-b bg-cream transition-[box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-cocoa/15 shadow-[0_10px_30px_-18px_rgba(56,35,30,0.45)]"
          : "border-transparent"
      }`}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="stripes stripes-slide h-1.5" aria-hidden="true" />
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-4">
        <a
          href="#top"
          className="shrink-0 rounded-md text-cocoa"
          onClick={() => setMenuOpen(false)}
        >
          <motion.span
            className="inline-block"
            whileHover={{ rotate: -2, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Wordmark />
          </motion.span>
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative rounded-sm py-2 font-medium text-cocoa transition-colors hover:text-cherry after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-right after:scale-x-0 after:rounded-full after:bg-cherry after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEnquiry()}
            className={buttonPrimaryCompact}
          >
            <span className="sm:hidden">Enquire</span>
            <span className="hidden sm:inline">Enquire to order</span>
          </button>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-cocoa hover:bg-rose-soft lg:hidden"
          >
            {menuOpen ? (
              <Close width={24} height={24} />
            ) : (
              <MenuIcon width={24} height={24} />
            )}
            <span className="sr-only">{menuOpen ? "Close menu" : "Menu"}</span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Main"
            className="overflow-hidden border-t border-cocoa/15 bg-cream lg:hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="shell py-3">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  className="border-b border-cocoa/10 last:border-0"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.45 }}
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-4 font-display text-[1.75rem] text-cocoa transition-[color,padding] duration-300 hover:pl-2 hover:text-cherry"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
