import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { Close, MenuIcon } from "@/components/Icons";
import { nav } from "@/config/site";
import { useEnquiry } from "@/lib/enquiryContext";
import { buttonPrimaryCompact } from "@/lib/ui";

export function Header() {
  const openEnquiry = useEnquiry();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

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
    <header className="sticky top-0 z-40 border-b border-cocoa/15 bg-cream">
      <div className="stripes h-1.5" aria-hidden="true" />
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-4">
        <a
          href="#top"
          className="shrink-0 rounded-md text-cocoa"
          onClick={() => setMenuOpen(false)}
        >
          <Wordmark />
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-sm py-2 font-medium text-cocoa underline-offset-[6px] decoration-cherry decoration-2 hover:text-cherry hover:underline"
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

      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!menuOpen}
        className="border-t border-cocoa/15 bg-cream lg:hidden"
      >
        <ul className="shell py-3">
          {nav.map((item) => (
            <li
              key={item.href}
              className="border-b border-cocoa/10 last:border-0"
            >
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block py-4 font-display text-[1.75rem] text-cocoa hover:text-cherry"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
