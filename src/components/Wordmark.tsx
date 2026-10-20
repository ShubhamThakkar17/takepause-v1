import { brand } from "@/config/site";

/**
 * Lowercase "take pause", finished with a pause mark in place of a full stop.
 * Drawn in type rather than an image so it stays crisp at every size.
 */
export function Wordmark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "md" | "lg" | "xl";
}) {
  const text = {
    md: "text-[1.6rem] md:text-[1.75rem]",
    lg: "text-[2.5rem]",
    xl: "text-[clamp(3.5rem,14vw,9rem)]",
  }[size];

  return (
    <span
      className={`inline-flex items-baseline font-display leading-none ${text} ${className}`}
    >
      <span
        aria-hidden="true"
        className="font-semibold tracking-[-0.04em]"
        style={{ fontVariationSettings: '"SOFT" 100' }}
      >
        {brand.wordmark}
      </span>
      <span
        aria-hidden="true"
        className="ml-[0.14em] inline-flex h-[0.42em] gap-[0.07em] self-baseline"
      >
        <span className="w-[0.085em] rounded-full bg-cherry" />
        <span className="w-[0.085em] rounded-full bg-cherry" />
      </span>
      <span className="sr-only">{brand.name}</span>
    </span>
  );
}
