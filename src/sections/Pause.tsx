import { pause } from "@/config/copy";

export function Pause() {
  return (
    <section
      aria-labelledby="pause-title"
      className="section scallop-top bg-rose [--scallop:var(--color-cream)]"
    >
      <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <div className="relative mx-auto w-full max-w-[26rem] lg:order-2 lg:max-w-[30rem]">
          <img
            src={pause.image.src}
            alt={pause.image.alt}
            width={pause.image.width}
            height={pause.image.height}
            loading="lazy"
            className="block w-full rounded-[2rem] border border-cocoa/15 bg-cream"
          />
          <p
            className="absolute -top-5 -right-2 rotate-6 rounded-full bg-butter px-5 py-2 font-script text-[1.5rem] text-cherry sm:-right-6"
            aria-hidden="true"
          >
            take a pause
          </p>
        </div>

        <div className="lg:order-1">
          <p className="eyebrow">{pause.eyebrow}</p>
          <h2 id="pause-title" className="display-lg mt-4 max-w-[14ch]">
            {pause.title}
          </h2>
          <p className="lede mt-6 max-w-[34rem] text-cocoa">{pause.body}</p>

          <ul className="mt-10 grid gap-6 sm:grid-cols-3 lg:gap-5">
            {pause.moments.map((m) => (
              <li
                key={m.title}
                className="flex gap-4 border-t-2 border-cocoa/80 pt-4 sm:block"
              >
                <img
                  src={m.image}
                  alt=""
                  width={120}
                  height={90}
                  className="h-16 w-auto shrink-0 sm:h-20"
                />
                <div>
                  <h3 className="font-display text-[1.3rem] leading-snug sm:mt-3">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-[0.95rem] text-cocoa-soft">
                    {m.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
