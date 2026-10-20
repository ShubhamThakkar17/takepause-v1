import { Info } from "@/components/Icons";
import { howToOrder } from "@/config/copy";
import { policies } from "@/config/site";
import { useEnquiry } from "@/lib/enquiryContext";
import { buttonOnCherry } from "@/lib/ui";

export function HowToOrder() {
  const openEnquiry = useEnquiry();
  const terms = [
    { label: "Notice", body: policies.leadTime },
    {
      label: "Pickup & delivery",
      body: `${policies.fulfilment} ${policies.pickupNote}`,
    },
    { label: "Confirmation", body: policies.confirmation },
  ];

  return (
    <section
      id="order"
      aria-labelledby="order-title"
      className="section scallop-top bg-rose-soft [--scallop:var(--color-cream)]"
    >
      <div className="shell">
        <p className="eyebrow">{howToOrder.eyebrow}</p>
        <h2 id="order-title" className="display-lg mt-4">
          {howToOrder.title}
        </h2>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {howToOrder.steps.map((step, i) => (
            <li key={step.title}>
              <span
                className="block font-display text-[4.5rem] leading-none text-cherry italic"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <h3 className="mt-3 border-t border-cocoa/25 pt-4 text-[1.6rem]">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-cocoa-soft">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <dl className="grid gap-px overflow-hidden rounded-[1.5rem] border border-cocoa/15 bg-cocoa/15 sm:grid-cols-3">
            {terms.map((t) => (
              <div key={t.label} className="bg-cream p-6">
                <dt className="font-semibold text-cherry">{t.label}</dt>
                <dd className="mt-2 text-[0.95rem] text-cocoa-soft">
                  {t.body}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col justify-between gap-6 rounded-[1.5rem] bg-cherry p-6 text-cream sm:p-8">
            <p className="flex gap-3">
              <Info className="mt-1 shrink-0" />
              <span className="text-[1.05rem]">{howToOrder.disclaimer}</span>
            </p>
            <button
              type="button"
              onClick={() => openEnquiry()}
              className={buttonOnCherry}
            >
              Start an enquiry
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
