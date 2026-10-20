import { Check } from "@/components/Icons";
import { celebrations } from "@/config/copy";
import { policies } from "@/config/site";
import { useEnquiry } from "@/lib/enquiryContext";
import { buttonPrimary } from "@/lib/ui";

export function Celebrations() {
  const openEnquiry = useEnquiry();

  return (
    <section
      aria-labelledby="celebrations-title"
      className="section scallop-top bg-cream [--scallop:var(--color-rose)]"
    >
      <div className="shell">
        <div className="relative overflow-hidden rounded-[2rem] border border-cocoa/15 bg-butter/45">
          <div
            className="stripes h-4 [--stripe-a:var(--color-cherry)] [--stripe-b:var(--color-butter)]"
            aria-hidden="true"
          />
          <div className="grid gap-10 p-6 sm:p-10 md:grid-cols-[1.15fr_0.85fr] md:items-center lg:p-14">
            <div>
              <p className="eyebrow">{celebrations.eyebrow}</p>
              <h2
                id="celebrations-title"
                className="display-lg mt-4 max-w-[16ch]"
              >
                {celebrations.title}
              </h2>
              <p className="lede mt-6 max-w-[36rem] text-cocoa">
                {celebrations.body}
              </p>
              <button
                type="button"
                onClick={() => openEnquiry({ intent: "celebration" })}
                className={`${buttonPrimary} mt-8 w-full sm:w-auto`}
              >
                {celebrations.cta}
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-cocoa/15 bg-cream p-6 sm:p-8">
              <h3 className="font-display text-[1.5rem]">How it works</h3>
              <ul className="mt-5 space-y-4">
                {celebrations.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-pistachio text-cream">
                      <Check width={14} height={14} strokeWidth={2.4} />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-cocoa/15 pt-4 text-[0.92rem] text-cocoa-soft">
                {policies.customisation} {policies.leadTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
