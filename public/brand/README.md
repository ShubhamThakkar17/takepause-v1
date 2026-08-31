# Brand assets

## Swapping in the real logo

The site currently draws the wordmark with webfonts (`src/components/Logo.tsx`)
so it renders crisply at any size and animates in stroke by stroke.

To use the original artwork instead, drop the file in here as:

    public/brand/logo.png        # the full lockup (flower + "pause" + tagline)

`Logo.tsx` picks it up automatically and falls back to the drawn version if the
file is missing — no code change needed.

Also worth adding when available:

    public/brand/og.png              # 1200×630 social share card
    public/brand/apple-touch-icon.png # 180×180
