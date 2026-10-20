import { ArrowRight, Pin } from "@/components/Icons";
import { hero } from "@/config/copy";
import { policies } from "@/config/site";
import { useEnquiry } from "@/lib/enquiryContext";
import { buttonPrimary, buttonSecondary } from "@/lib/ui";

export function Hero() {
  const openEnquiry = useEnquiry();

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden"
    >
      <div className="shell grid items-center gap-10 pt-8 pb-16 md:pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pt-16 lg:pb-24">
        <div className="max-w-[40rem]">
          <p className="inline-flex items-center gap-2 rounded-full border border-cocoa/20 bg-white/60 py-1.5 pr-4 pl-3 text-[0.9rem] font-medium">
            <Pin width={17} height={17} className="text-cherry" />
            {hero.location}
          </p>

          <h1 id="hero-title" className="display-xl mt-6 md:mt-8">
            <span className="block">{hero.title[0]}</span>
            <span className="block text-cherry italic">{hero.title[1]}</span>
          </h1>

          <p className="lede mt-6 max-w-[32rem] md:mt-8">{hero.body}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="#bakes" className={buttonPrimary}>
              {hero.primary} <ArrowRight width={18} height={18} />
            </a>
            <button
              type="button"
              onClick={() => openEnquiry()}
              className={buttonSecondary}
            >
              {hero.secondary}
            </button>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] text-cocoa-soft">
            {["Eggless", "Made to order", policies.leadTimeShort].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <span
                    className="size-1.5 rounded-full bg-cherry"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
          {/* An offset outline, like a slightly misregistered print. */}
          <div
            className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-full border-2 border-cherry sm:translate-x-4 sm:translate-y-4"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-t-full border border-cocoa/15 bg-rose">
            <img
              src={hero.image.src}
              alt={hero.image.alt}
              width={hero.image.width}
              height={hero.image.height}
              fetchPriority="high"
              className="block h-auto w-full"
            />
          </div>

          <div
            className="absolute -bottom-5 -left-2 flex size-28 rotate-[-10deg] flex-col items-center justify-center rounded-full border-2 border-dashed border-cream bg-pistachio text-center text-cream ring-4 ring-pistachio sm:-left-6 sm:size-32"
            aria-hidden="true"
          >
            <span className="font-display text-[1.6rem] leading-none font-semibold sm:text-[1.9rem]">
              {hero.stamp[0]}
            </span>
            <span className="font-script text-[1.35rem] leading-none sm:text-[1.55rem]">
              {hero.stamp[1]}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
