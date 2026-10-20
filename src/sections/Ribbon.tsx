import { Marquee } from "@/components/Motion";
import { ribbon } from "@/config/copy";

/** Two crossed bands of words that drift sideways and speed up as you scroll. */
export function Ribbon() {
  return (
    <div aria-hidden="true" className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[4deg]">
        <Marquee speed={30} direction={-1} className="bg-butter py-2.5">
          {ribbon.back.map((word) => (
            <span
              key={word}
              className="flex items-center gap-6 px-3 font-sans text-[0.85rem] font-semibold tracking-[0.18em] text-cocoa uppercase"
            >
              {word}
              <span className="text-pistachio">●</span>
            </span>
          ))}
        </Marquee>
      </div>
      <div className="relative -mx-[5%] -rotate-[2.5deg]">
        <Marquee
          speed={45}
          className="border-y-2 border-cocoa bg-cherry py-3 md:py-4"
        >
          {ribbon.front.map((word) => (
            <span
              key={word}
              className="flex items-center gap-6 px-3 font-display text-[1.6rem] text-cream italic md:text-[2.1rem]"
            >
              {word}
              <svg viewBox="0 0 24 24" className="size-5 text-rose md:size-6">
                <path
                  fill="currentColor"
                  d="M12 0c.6 5.8 2.9 9 12 12-9.1 3-11.4 6.2-12 12-.6-5.8-2.9-9-12-12C9.1 9 11.4 5.8 12 0z"
                />
              </svg>
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
