# takepause.in

The website for **Take Pause**, Rutvi's eggless home dessertery in Vadodara.
*A little pause, something sweet.*

It's a single page: the menu, a little about the bakery, how ordering works,
and an enquiry form that can take reference photos.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
npm run preview  # serve the build at http://localhost:4173
npm run lint
```

`dist/` is plain static files. Netlify, Vercel, Cloudflare Pages or any static
host can serve it as-is.

## Where to change things

| What | File |
|---|---|
| Menu: items, sizes, prices, images | `src/config/menu.ts` |
| How prices appear (`₹700 onwards` / `₹700–₹950` / `₹700+`) | `priceDisplay` in `src/config/menu.ts` |
| Business details, ordering terms, contact channels | `src/config/site.ts` |
| Words on the page, section by section | `src/config/copy.ts` |
| Colours and type | `@theme` in `src/index.css` |
| Contact details and the enquiry backend URL, without code changes | environment variables (`.env.example`) |

The site only ever shows **starting prices or ranges**. Exact prices are kept
in `menu.ts` so those ranges stay correct.

## The enquiry form

It's enquiry-first: nothing is a confirmed order until the bakery replies. The
form asks for the bake (with flavour, filling, ganache and toppings where they
apply), a preferred date (from tomorrow onwards), quantity, occasion,
pickup or delivery, notes, name and phone.

How an enquiry is sent depends on what's configured. The first available
channel wins:

| Configured | What the customer sees |
|---|---|
| `VITE_ENQUIRY_ENDPOINT` | **Send enquiry**, with up to 3 reference photos. Each enquiry becomes a row in a Google Sheet, and its photos go into a Drive folder. Customers don't need a Google account. They see a reference number, plus an optional WhatsApp follow-up link if a number is set. |
| `VITE_WHATSAPP_NUMBER` | **Continue on WhatsApp** opens a chat with the enquiry written out. The site says clearly that nothing is sent until they press send. |
| *(nothing)* | **Copy enquiry for Instagram** copies the message and links to a DM with @takepause.in. This works today, before anything else is set up. |

The site only shows success after the Sheet confirms it saved the enquiry.
WhatsApp and Instagram are presented as hand-offs, never as "sent".

**Set up the Google Sheet and Drive backend:**
[`backend/google-apps-script/README.md`](backend/google-apps-script/README.md)
(about 5 minutes; no server or paid plan).

`takepause.in/#enquire` opens the form directly, which is handy for the
Instagram bio.

## Instagram feed

Instagram doesn't let a website read posts without an access token, so the
feed goes through a small feed service:

1. Create a free feed at [behold.so](https://behold.so) and connect the
   @takepause.in account. It needs to be a Business or Creator account, which
   is free to switch to in Instagram's settings.
2. Copy the feed's **JSON URL** into `VITE_INSTAGRAM_FEED_URL`.

The section then shows the 6 latest posts. Until then, or if the feed ever
fails, it shows a link to the profile instead.

## Still needed from the bakery

Business details. Each one stays hidden on the site until it's set:

- [ ] **WhatsApp business number:** `VITE_WHATSAPP_NUMBER`
- [ ] **Email address** (if there is one): `VITE_CONTACT_EMAIL`
- [ ] **Enquiry backend:** deploy the Apps Script and set `VITE_ENQUIRY_ENDPOINT`
- [ ] **Instagram feed URL:** `VITE_INSTAGRAM_FEED_URL`
- [ ] **Rutvi's story, in her own words:** `story.paragraphs` in `src/config/copy.ts`
- [ ] **A photo of Rutvi, or of her baking:** `story.photo` in `copy.ts` (4:5, about 960×1200)

Photos (see below):

- [ ] Real photos of each bake, to replace the illustrations
- [ ] Optionally, a hero photo

Already taken from the printed menu (Sept 2026), so check them if anything
has changed: the menu and prices, "eggless", pre-orders only (24–48 hours'
notice), free self-pickup or Porter delivery (charged extra), confirmation by
50% advance, and customisation available (design may cost extra).

Deliberately left off the site until verified: street address, opening
hours, delivery areas, reviews or customer counts, founding year, and any
dietary claims beyond "eggless".

## Photos

Every image in `public/images/` is a **temporary illustration**, drawn by
`scripts/illustrations.mjs`. They are illustrations on purpose: nothing on the
site pretends to be a real Take Pause product photo.

To swap in real photos:

1. Shoot in natural light, on a warm tabletop, with a consistent angle per
   category. Crumbs, icing texture and a cut slice all help.
2. Export JPG or WebP at about **1200×900 (4:3)** for bakes, **960×1200
   (4:5)** for the story, and **800×960** for the hero. Aim for under 250 KB
   each.
3. Put them in `public/images/bakes/` (or `scenes/`), then update `src` in
   `menu.ts` / `copy.ts`. For bakes, set `kind: "photo"` so they fill the
   frame.

| Image | Used for | Replace in |
|---|---|---|
| `scenes/hero.svg` | Hero | `hero.image` in `copy.ts` |
| `bakes/*.svg` | Menu cards | `bakes[].image` in `menu.ts` |
| `scenes/texture.svg` | "A pause worth taking" | `pause.image` in `copy.ts` |
| `scenes/kitchen.svg` | Our story (until there's a photo) | `story.photo` in `copy.ts` |
| `scenes/chai.svg`, `gift.svg`, `candle.svg` | Small icons | `pause.moments` in `copy.ts` |

## SEO and sharing

- The title, description, canonical URL and Open Graph/Twitter tags are in
  `index.html`. `VITE_SITE_URL` sets the canonical origin
  (`https://takepause.in`).
- Structured data (`Bakery`) has only verified facts: the name, Vadodara,
  Gujarat, and the Instagram profile. Add an address, phone or hours there
  once they're confirmed.
- `public/brand/og.png` (the share card) and `apple-touch-icon.png` come from
  `scripts/social-images.mjs`, which needs Playwright.
- `public/robots.txt` and `public/sitemap.xml` point at takepause.in.

## Built with

Vite · React · TypeScript · Tailwind CSS v4. Fonts are Fraunces (headlines),
DM Sans (body) and Yellowtail (the occasional handwritten accent). They're
self-hosted from npm (`@fontsource`), so there are no third-party requests.

There's no animation library. Movement is limited to hover states and smooth
anchor scrolling, and both turn off when the visitor prefers reduced motion.
The site uses a single light palette and opts out of the browser's automatic
dark mode, so the food never gets colour-inverted.
