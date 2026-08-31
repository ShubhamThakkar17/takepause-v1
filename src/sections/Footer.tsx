import { footer, brand, nav, contact } from "@/content/site";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";

export function Footer() {
  return (
    <footer className="u-grain relative overflow-hidden bg-ink pt-24 pb-10 text-cream">
      <div className="u-shell">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <Logo size="lg" tone="cream" />
            <p className="mt-10 font-display text-[clamp(1.3rem,3.4vw,2rem)] font-light text-cream/85 italic">
              {footer.line}
            </p>
          </div>
        </Reveal>

        <nav className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-cream/15 pt-10">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-sans text-[0.72rem] tracking-[0.18em] text-cream/60 uppercase transition-colors duration-400 hover:text-cream"
            >
              {item.label}
            </a>
          ))}
          <a
            href={contact.instagram.href}
            target="_blank"
            rel="noreferrer noopener"
            className="font-sans text-[0.72rem] tracking-[0.18em] text-cream/60 uppercase transition-colors duration-400 hover:text-cream"
          >
            Instagram
          </a>
        </nav>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 text-[0.7rem] tracking-[0.12em] text-cream/45 sm:flex-row">
          <p>{footer.copyright}</p>
          <p>
            Baked by {brand.founder} · {brand.domain}
          </p>
        </div>
      </div>
    </footer>
  );
}
