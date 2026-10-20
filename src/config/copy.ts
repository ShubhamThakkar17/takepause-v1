/**
 * Words on the page, section by section. Business facts (terms, contact
 * details) live in ./site.ts; the menu lives in ./menu.ts.
 */
import { brand } from "./site";

export const hero = {
  location: `Homemade in ${brand.city}`,
  title: ["A little pause.", "A little sweetness."],
  body: "Homemade bakes from Vadodara, for everyday cravings and moments worth celebrating.",
  primary: "Explore our bakes",
  secondary: "Enquire to order",
  stamp: ["100%", "eggless"],
  image: {
    src: "/images/scenes/hero.svg",
    alt: "Illustration of a tall celebration cake on a cake stand, decorated with piped cream and cherries",
    width: 800,
    height: 960,
  },
};

export const bakesSection = {
  eyebrow: "The menu",
  title: "Our bakes",
  body: "Everything is eggless and made to order. Prices depend on size and flavour, so we show where each one starts — we'll confirm the exact amount when you enquire.",
};

export const pause = {
  eyebrow: "A pause worth taking",
  title: "For the in-between moments.",
  body: "Not every sweet thing needs an occasion. Sometimes it's a brownie with your four o'clock chai, a box left on a friend's doorstep, or a cake that turns an ordinary evening into a small celebration.",
  moments: [
    {
      title: "An afternoon break",
      body: "A cookie and a cup of chai, ten quiet minutes.",
      image: "/images/scenes/chai.svg",
    },
    {
      title: "A thoughtful gift",
      body: "A box of something sweet says it better than a text.",
      image: "/images/scenes/gift.svg",
    },
    {
      title: "A small celebration",
      body: "Candles optional. The cake is not.",
      image: "/images/scenes/candle.svg",
    },
  ],
  image: {
    src: "/images/scenes/texture.svg",
    alt: "Illustration of a piping bag swirling buttercream rosettes onto a pink cake",
    width: 720,
    height: 880,
  },
};

export const celebrations = {
  eyebrow: "Celebration enquiries",
  title: "Something special on the calendar?",
  body: "Birthdays, anniversaries, a thank-you, a Tuesday that needs it. Tell us the date and what you have in mind — reference photos help — and we'll let you know what's possible.",
  points: [
    "Share a reference photo of the cake you're picturing",
    "Choose your sponge, filling and frosting",
    "We confirm design, price and date with you before anything is booked",
  ],
  cta: "Plan something sweet",
};

export const story = {
  eyebrow: "Our story",
  title: "Baked at home, in Vadodara.",
  /**
   * Replace these with Rutvi's own words when she's ready. Keep it in her
   * voice; nothing here should claim more than is true.
   */
  paragraphs: [
    `Take Pause is ${brand.founder}'s home dessertery in Vadodara. Everything is eggless and baked to order in a home kitchen, so each box is made for the person who asked for it.`,
    "The name is the idea: a little pause in a busy day, and something sweet to fill it.",
  ],
  signature: `${brand.founder}, founder`,
  /**
   * A portrait or a photo of Rutvi baking. Leave null to show the
   * illustration instead. Recommended: 4:5 crop, about 960×1200.
   */
  photo: null as { src: string; alt: string } | null,
  illustration: {
    src: "/images/scenes/kitchen.svg",
    alt: "Illustration of a home baking counter with a mixing bowl, whisk and piping bag",
  },
};

export const howToOrder = {
  eyebrow: "How to order",
  title: "Three simple steps.",
  steps: [
    {
      title: "Choose your bakes",
      body: "Browse the menu and pick what you'd like — or tell us you need help choosing.",
    },
    {
      title: "Share your date and details",
      body: "Send an enquiry with your preferred date, quantity and any notes or reference photos.",
    },
    {
      title: "Confirm with us",
      body: "We reply to confirm availability, the final price and pickup or delivery. Then it's booked.",
    },
  ],
  disclaimer:
    "An enquiry isn't a confirmed order. We'll get back to you to check availability and details first.",
};

export const instagramSection = {
  eyebrow: "Follow along",
  title: "Fresh from the kitchen",
  body: "New bakes, behind-the-scenes and what's coming out of the oven this week.",
};

export const footer = {
  line: "A little pause, something sweet.",
};
