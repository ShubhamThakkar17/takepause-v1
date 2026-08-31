import { useEffect, useState } from "react";
import { brand } from "@/content/site";
import { Flower } from "./Flower";

const ORIGINAL = "/brand/logo.png";

/**
 * The lockup. If the original artwork is present at {@link ORIGINAL} it wins;
 * otherwise we draw a close stand-in from webfonts and the vector bloom, so the
 * site is never sitting on a broken image.
 */
export function Logo({
  className = "",
  withTagline = true,
  size = "md",
  tone = "ink",
}: {
  className?: string;
  withTagline?: boolean;
  size?: "sm" | "md" | "lg";
  /** "cream" repaints the mark for dark grounds — a CSS invert would skew the blush to teal. */
  tone?: "ink" | "cream";
}) {
  const [hasOriginal, setHasOriginal] = useState(false);

  useEffect(() => {
    const probe = new Image();
    probe.onload = () => setHasOriginal(true);
    probe.src = ORIGINAL;
  }, []);

  const scale = {
    sm: { word: "text-[1.75rem]", tag: "text-[0.5rem]", flower: "w-9", img: "h-9" },
    md: { word: "text-[2.75rem]", tag: "text-[0.6rem]", flower: "w-14", img: "h-14" },
    lg: { word: "text-[4.5rem]", tag: "text-[0.8rem]", flower: "w-24", img: "h-28" },
  }[size];

  if (hasOriginal) {
    return (
      <img
        src={ORIGINAL}
        alt={`${brand.name} — ${brand.tagline}`}
        className={`${scale.img} w-auto object-contain ${className}`}
      />
    );
  }

  const onDark = tone === "cream";

  return (
    <span className={`relative inline-flex flex-col items-center ${className}`}>
      <span className="relative inline-flex items-end">
        <Flower
          id={`logo-${tone}`}
          petal={onDark ? "#e9ab9c" : "#e5a091"}
          petalLight={onDark ? "#f6ddd5" : "#f7ded6"}
          stem={onDark ? "#9fb392" : "#a2b393"}
          className={`${scale.flower} absolute -top-[42%] left-[-6%] -z-10 ${
            onDark ? "opacity-80" : "opacity-90"
          }`}
        />
        <span
          className={`font-script ${scale.word} leading-[0.9] ${onDark ? "text-cream" : "text-ink"}`}
          style={{ transform: "rotate(-3deg)" }}
        >
          {brand.wordmark}
        </span>
      </span>
      {withTagline && (
        <span
          className={`font-display ${scale.tag} mt-1 tracking-[0.34em] lowercase ${
            onDark ? "text-cream/70" : "text-ink-soft"
          }`}
        >
          {brand.tagline}
        </span>
      )}
      <span className="sr-only">{brand.name}</span>
    </span>
  );
}
