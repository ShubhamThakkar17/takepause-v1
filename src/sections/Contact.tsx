import { contact } from "@/content/site";
import { Reveal, RevealLines, RevealGroup } from "@/components/Reveal";
import { revealChild } from "@/lib/motion";
import { motion } from "motion/react";

export function Contact() {
  const details = [
    { label: "Call", value: contact.phone.label, href: contact.phone.href },
    { label: "Write", value: contact.email.label, href: contact.email.href },
    { label: "Instagram", value: contact.instagram.label, href: contact.instagram.href },
  ];

  return (
    <section id="contact" className="u-grain relative bg-cream py-(--spacing-section)">
      <div className="u-shell">
        <div className="text-center">
          <Reveal>
            <p className="u-eyebrow">{contact.eyebrow}</p>
          </Reveal>
          <h2 className="u-display mt-6 text-[clamp(2.4rem,7vw,5.6rem)]">
            <RevealLines lines={[contact.title]} />
          </h2>
          <Reveal delay={0.2}>
            <p className="u-body mx-auto mt-7 max-w-[42ch]">{contact.body}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <a
              href={contact.whatsapp.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative mt-11 inline-block overflow-hidden rounded-full bg-ink px-11 py-4.5 font-sans text-[0.76rem] tracking-[0.22em] text-cream uppercase"
            >
              <span className="relative z-10">{contact.whatsapp.label}</span>
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-blush transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
            </a>
          </Reveal>
        </div>

        <div className="mt-24 grid gap-12 border-t border-line pt-16 md:grid-cols-3">
          <RevealGroup className="space-y-7">
            {details.map((detail) => (
              <motion.div key={detail.label} variants={revealChild}>
                <p className="u-eyebrow text-[0.62rem]">{detail.label}</p>
                <a
                  href={detail.href}
                  target={detail.href.startsWith("http") ? "_blank" : undefined}
                  rel={detail.href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="mt-2 inline-block font-display text-[clamp(1.15rem,2.4vw,1.55rem)] text-ink transition-colors duration-400 hover:text-blush"
                >
                  {detail.value}
                </a>
              </motion.div>
            ))}
          </RevealGroup>

          <Reveal delay={0.1}>
            <p className="u-eyebrow text-[0.62rem]">Find us</p>
            <address className="mt-3 font-display text-[clamp(1.15rem,2.4vw,1.55rem)] leading-relaxed text-ink not-italic">
              {contact.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="u-eyebrow text-[0.62rem]">Hours</p>
            <ul className="mt-3 space-y-3">
              {contact.hours.map((row) => (
                <li
                  key={row.days}
                  className="flex items-baseline justify-between gap-4 border-b border-line/70 pb-2.5"
                >
                  <span className="font-sans text-sm text-ink-soft">{row.days}</span>
                  <span className="font-display text-base text-ink">{row.time}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
