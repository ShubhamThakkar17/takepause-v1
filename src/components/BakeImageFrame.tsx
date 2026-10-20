import type { BakeImage } from "@/config/menu";

/**
 * A fixed-ratio frame so the grid never shifts while images load.
 * Illustrations sit on a tinted ground; photos fill the frame.
 */
export function BakeImageFrame({
  image,
  tint,
  ratio = "wide",
  className = "",
}: {
  image: BakeImage;
  tint: string;
  ratio?: "wide" | "square";
  className?: string;
}) {
  const aspect = ratio === "square" ? "aspect-square" : "aspect-[4/3]";
  return (
    <div
      className={`overflow-hidden rounded-[1.5rem] border border-cocoa/15 ${tint} ${aspect} ${className}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        width={ratio === "square" ? 300 : 400}
        height={300}
        loading="lazy"
        decoding="async"
        className={`size-full ${image.kind === "photo" ? "object-cover" : "object-contain"}`}
      />
    </div>
  );
}
