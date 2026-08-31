/**
 * The bloom from the brand mark, redrawn as vector so it can be scaled,
 * tinted and floated around the page.
 *
 * `detail` carries the stamen speckles at logo size; they're dropped when the
 * flower is blown up as background art, where they'd read as a face.
 */
export function Flower({
  className,
  petal = "#e5a091",
  petalLight = "#f7ded6",
  stem = "#a2b393",
  withStem = true,
  detail = true,
  id,
}: {
  className?: string;
  petal?: string;
  petalLight?: string;
  stem?: string;
  withStem?: boolean;
  detail?: boolean;
  id: string;
}) {
  return (
    <svg viewBox="0 0 120 150" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`petal-${id}`} cx="50%" cy="72%" r="62%">
          <stop offset="0" stopColor={petal} stopOpacity="0.95" />
          <stop offset="0.55" stopColor={petal} stopOpacity="0.62" />
          <stop offset="1" stopColor={petalLight} stopOpacity="0.42" />
        </radialGradient>
        <filter id={`soft-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
      </defs>

      {withStem && (
        <g opacity="0.85">
          <path
            d="M60 62 C 58.5 92, 56.5 118, 54 148"
            stroke={stem}
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M57.6 98c-2.4-12.6-11-19-23.6-21.4 13.8-3.4 21.6 3.4 25.4 14.4z"
            fill={stem}
            opacity="0.92"
          />
          <path
            d="M58.6 124c2.8-10.4 9.4-15.2 19-16.4-10.6-3.4-17.2 2-21 10.6z"
            fill={stem}
            opacity="0.72"
          />
        </g>
      )}

      {/* Five soft petals, each a teardrop rather than an ellipse, so the
          silhouette still reads as a flower when scaled up. */}
      <g filter={`url(#soft-${id})`}>
        <g fill={`url(#petal-${id})`}>
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <path
              key={deg}
              d="M60 55 C 44 47, 39 27, 47 15 C 53 6, 67 6, 73 15 C 81 27, 76 47, 60 55 Z"
              transform={`rotate(${deg} 60 55)`}
              opacity={0.88 - (i % 2) * 0.08}
            />
          ))}
        </g>
      </g>

      {/* The pale heart of the flower only reads at mark size; blown up as
          background art it turns into a hole, so it goes with the detail. */}
      {detail && <circle cx="60" cy="55" r="7.5" fill={petalLight} opacity="0.9" />}

      {detail && (
        <g fill={petal} opacity="0.55">
          <circle cx="57.2" cy="53.2" r="1.3" />
          <circle cx="62.8" cy="53.8" r="1.3" />
          <circle cx="59.6" cy="57.8" r="1.3" />
        </g>
      )}
    </svg>
  );
}
