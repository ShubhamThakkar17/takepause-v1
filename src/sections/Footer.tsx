import { Instagram, Mail, Pin, WhatsApp } from "@/components/Icons";
import { Reveal } from "@/components/Motion";
import { Wordmark } from "@/components/Wordmark";
import { footer } from "@/config/copy";
import { brand, contact, links, nav } from "@/config/site";
import { useEnquiry } from "@/lib/enquiryContext";

export function Footer() {
  const openEnquiry = useEnquiry();
  const channels = [
    links.whatsapp && {
      href: links.whatsapp,
      label: "WhatsApp",
      icon: WhatsApp,
    },
    links.instagram && {
      href: links.instagram,
      label: `@${contact.instagram}`,
      icon: Instagram,
    },
    links.email && { href: links.email, label: contact.email!, icon: Mail },
  ].filter(Boolean) as { href: string; label: string; icon: typeof Mail }[];

  return (
    <footer className="scallop-top bg-rose [--scallop:var(--color-cream)]">
      <div className="shell pt-16 pb-10 md:pt-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark size="lg" />
            <p className="mt-4 max-w-[22rem] text-cocoa">{footer.line}</p>
            <p className="mt-4 flex items-center gap-2 text-cocoa-soft">
              <Pin width={18} height={18} className="text-cherry" />
              {brand.descriptor} · {brand.city}, {brand.region}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-sans text-[0.8125rem] font-semibold tracking-[0.14em] text-cherry uppercase">
              Explore
            </h2>
            <ul className="mt-4 space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-block py-1.5 transition-[color,transform] duration-300 hover:translate-x-1 hover:text-cherry"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => openEnquiry()}
                  className="py-1.5 transition-[color,transform] duration-300 hover:translate-x-1 hover:text-cherry"
                >
                  Enquire to order
                </button>
              </li>
            </ul>
          </nav>

          {channels.length > 0 && (
            <div>
              <h2 className="font-sans text-[0.8125rem] font-semibold tracking-[0.14em] text-cherry uppercase">
                Say hello
              </h2>
              <ul className="mt-4 space-y-1">
                {channels.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 py-1.5 transition-[color,transform] duration-300 hover:translate-x-1 hover:text-cherry"
                    >
                      <Icon width={18} height={18} /> {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* A big sign-off that rises as the page ends. */}
        <Reveal y={80} amount={0.4} className="mt-16 overflow-hidden">
          <Wordmark size="xl" className="text-cocoa/90" />
        </Reveal>

        <div className="mt-8 flex flex-col gap-2 border-t border-cocoa/20 pt-6 text-[0.9rem] text-cocoa-soft sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.name}
          </p>
          <p>Homemade in {brand.city}</p>
        </div>
      </div>
    </footer>
  );
}
