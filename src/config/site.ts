/**
 * Business details and site-wide settings — the one place to update them.
 *
 * Rule of thumb: if a detail isn't verified, leave it `null`. The interface
 * hides anything that's missing instead of showing a placeholder, and the
 * enquiry form falls back to the channels that *are* configured.
 *
 * Contact channels and the enquiry backend can also be set at build time
 * through environment variables (see `.env.example`), so they never need to
 * be committed if you'd rather keep them out of the repo.
 */

const env = import.meta.env;

/** Turns an empty env var into `null`, so "not set" has a single meaning. */
const optional = (value: string | undefined) =>
  value && value.trim() ? value.trim() : null;

export const brand = {
  name: "Take Pause",
  /** Shown as the lowercase wordmark in the header and footer. */
  wordmark: "take pause",
  /** From the printed menu. */
  descriptor: "Eggless home dessertery",
  city: "Vadodara",
  region: "Gujarat",
  country: "IN",
  founder: "Rutvi",
} as const;

export const site = {
  /** Canonical origin. Also used by index.html via VITE_SITE_URL. */
  url: optional(env.VITE_SITE_URL) ?? "https://takepause.in",
  title: "Take Pause — Eggless home bakes in Vadodara",
  description:
    "Take Pause is an eggless home dessertery in Vadodara. Cheesecakes, cookies, brownies and made-to-order cakes for everyday cravings and moments worth celebrating.",
};

export const contact = {
  /**
   * WhatsApp business number in international format, digits only — e.g.
   * "9198XXXXXXXX". Leave null until the number is verified; the WhatsApp
   * option stays hidden until then.
   */
  whatsapp: optional(env.VITE_WHATSAPP_NUMBER),
  /** Public email address, e.g. "hello@takepause.in". */
  email: optional(env.VITE_CONTACT_EMAIL),
  /** Verified: https://www.instagram.com/takepause.in/ */
  instagram: "takepause.in" as string | null,
};

export const enquiry = {
  /**
   * URL of the deployed Google Apps Script web app (ends in /exec). With it
   * set, the form saves enquiries to a Google Sheet and uploads reference
   * photos to a Drive folder. Setup: backend/google-apps-script/README.md
   */
  endpoint: optional(env.VITE_ENQUIRY_ENDPOINT),
  maxPhotos: 3,
  /** Photos are resized in the browser to this longest edge before upload. */
  photoMaxEdge: 1600,
  /** Upload limit per original photo, before resizing. */
  photoMaxMb: 15,
  /** Earliest bookable date, counted in days from today. */
  minLeadDays: 1,
};

/**
 * Ordering terms. These come from the printed menu (Sept 2026) — update them
 * here if anything changes and the site follows.
 */
export const policies = {
  leadTime: "Pre-orders only — please book 24–48 hours in advance.",
  leadTimeShort: "Book 24–48 hours ahead",
  fulfilment:
    "Free self-pickup in Vadodara, or delivery via Porter (charged separately).",
  confirmation: "Your order is confirmed only once a 50% advance is paid.",
  /** Pickup address is shared privately once an order is confirmed. */
  pickupNote: "The pickup location is shared when your order is confirmed.",
  customisation:
    "Customisation is available on cakes — design work may cost extra.",
};

export const nav = [
  { label: "Our Bakes", href: "#bakes" },
  { label: "Our Story", href: "#story" },
  { label: "How to Order", href: "#order" },
] as const;

export const links = {
  instagram: contact.instagram
    ? `https://www.instagram.com/${contact.instagram}/`
    : null,
  /** Opens a direct-message thread with the account in the Instagram app. */
  instagramDm: contact.instagram
    ? `https://ig.me/m/${contact.instagram}`
    : null,
  email: contact.email ? `mailto:${contact.email}` : null,
  whatsapp: contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : null,
};

export const instagramFeed = {
  /**
   * A JSON feed URL for the latest posts — Behold (behold.so) works out of
   * the box. Instagram doesn't allow reading a feed without an access token,
   * so a feed service holds that token for us. Without it, the section shows
   * a link to the profile instead. Setup: README → "Instagram feed".
   */
  url: optional(env.VITE_INSTAGRAM_FEED_URL),
  limit: 6,
};
