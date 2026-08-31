/**
 * Every word on the site lives here.
 *
 * Copy is carried over from the Pause & Indulge draft. Anything marked
 * PLACEHOLDER below is invented filler from that draft and needs Rutvi's
 * real details before this goes anywhere near takepause.in.
 */

export const brand = {
  name: "Take A Pause",
  wordmark: "pause",
  tagline: "a little peace, plated",
  founder: "Rutvi Dharsandhiya",
  domain: "takepause.in",
} as const;

export const nav = [
  { label: "Our Story", href: "#story" },
  { label: "Menu", href: "#menu" },
  { label: "Custom Cakes", href: "#process" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  eyebrow: "Small-batch bakery",
  title: ["Take A Pause.", "Have Something Sweet."],
  subtitle:
    "Handcrafted bakes, beautiful moments, and little reasons to slow down.",
  primaryCta: { label: "Order Now", href: "#contact" },
  secondaryCta: { label: "Explore Our Menu", href: "#menu" },
  scrollCue: "Scroll gently",
};

export const ribbon = [
  "a little peace, plated",
  "small batch",
  "baked to order",
  "no shortcuts",
  "a little peace, plated",
  "made by hand",
  "worth slowing down for",
];

export const story = {
  eyebrow: "Our Story",
  title: "Good things are worth slowing down for.",
  body: [
    "At Take A Pause, we believe the sweetest moments are often the simplest ones — a beautifully crafted cake, a warm pastry, a box of treats shared with someone you love.",
  ],
  signature: `${brand.founder}, founder`,
  image: "/images/story.svg",
  imageAlt: "A slice of cake resting on a pale ceramic plate",
  stats: [
    { value: "3 days", label: "to laminate one pastry" },
    { value: "Small", label: "batches, every morning" },
    { value: "100%", label: "made to order" },
  ],
};

export const menu = {
  eyebrow: "The Menu",
  title: "Everything, made the long way.",
  note: "Prices are a starting point — they move with size, flavour and finish.",
  cta: { label: "View Full Menu", href: "#contact" },
  items: [
    {
      name: "Celebration Cakes",
      price: "₹1,450",
      description: "Soft sponge, silk buttercream, quietly beautiful finishes.",
      image: "/images/menu-01.svg",
    },
    {
      name: "Custom Cakes",
      price: "₹2,400",
      description: "Designed with you, from the first sketch to the last petal.",
      image: "/images/menu-02.svg",
    },
    {
      name: "Cupcakes",
      price: "₹480",
      description: "Six little pauses, swirled and boxed by hand.",
      image: "/images/menu-03.svg",
    },
    {
      name: "Brownies",
      price: "₹420",
      description: "Dense, fudgy, crackle-topped, deeply chocolate.",
      image: "/images/menu-04.svg",
    },
    {
      name: "Cookies",
      price: "₹360",
      description: "Golden edges, soft middles, still warm if you're lucky.",
      image: "/images/menu-05.svg",
    },
    {
      name: "Pastries",
      price: "₹320",
      description: "Laminated slowly over three days. Worth the wait.",
      image: "/images/menu-06.svg",
    },
    {
      name: "Dessert Boxes",
      price: "₹890",
      description: "A curated little box for someone who needs a pause.",
      image: "/images/menu-07.svg",
    },
  ],
};

export const process = {
  eyebrow: "Custom Cakes",
  title: "Four unhurried steps.",
  subtitle:
    "No forms to wrestle with. Just a conversation that ends in something beautiful.",
  cta: { label: "Create Your Cake", href: "#contact" },
  steps: [
    {
      n: "01",
      title: "Tell Us Your Idea",
      body: "Share the occasion, the flavours you love, and any inspiration you have saved — a blurry photo is plenty.",
    },
    {
      n: "02",
      title: "Let's Create",
      body: "We design it together: proportion, palette, the small details that make it look like it belongs to you.",
    },
    {
      n: "03",
      title: "We Bake",
      body: "In small batches, on the morning of collection, so it reaches you at its best and nothing sits waiting.",
    },
    {
      n: "04",
      title: "Take A Pause",
      body: "Put the phone down. Cut a slice. Let the moment take as long as it wants to take.",
    },
  ],
};

export const occasions = {
  eyebrow: "We bake for",
  title: "The days worth marking.",
  items: [
    "Birthdays",
    "Anniversaries",
    "Weddings",
    "Engagements",
    "Baby Showers",
    "Corporate Events",
  ],
};

export const philosophy = {
  eyebrow: "Why Take A Pause",
  title: ["Pause.", "Breathe.", "Indulge."],
  body: "We started with a simple thought: the days move quickly, and most of the good things slip past unnoticed. A pause is how you catch them — five quiet minutes, a plate, a fork, something worth tasting slowly. So we bake for both ends of life.",
};

export const gallery = {
  eyebrow: "Gallery",
  title: "Follow Our Sweet Journey",
  handle: "@takepause.in",
  href: "https://www.instagram.com/takepause.in",
  cta: { label: "See more on Instagram", href: "https://www.instagram.com/takepause.in" },
  images: [
    { src: "/images/gallery-01.svg", alt: "A two-tier cake finished in pale buttercream" },
    { src: "/images/gallery-02.svg", alt: "Cupcakes lined up in an open box" },
    { src: "/images/gallery-03.svg", alt: "Brownies stacked on parchment" },
    { src: "/images/gallery-04.svg", alt: "A pastry torn open to show its layers" },
    { src: "/images/gallery-05.svg", alt: "Cookies cooling on a wire rack" },
    { src: "/images/gallery-06.svg", alt: "A dessert box tied with ribbon" },
    { src: "/images/gallery-07.svg", alt: "Piping a border of buttercream petals" },
    { src: "/images/gallery-08.svg", alt: "A single slice on a ceramic plate" },
    { src: "/images/gallery-09.svg", alt: "A finished cake waiting on the counter" },
  ],
};

export const testimonials = {
  eyebrow: "Kind Words",
  title: "What people say after the first bite.",
  items: [
    {
      quote:
        "The cake arrived looking like something out of a magazine — and somehow tasted even better.",
      name: "Ananya",
    },
    {
      quote:
        "I ordered a dessert box on a whim for my wife. She still talks about the salted caramel brownie.",
      name: "Rohan",
    },
    {
      quote:
        "They understood the design from one blurry reference photo. My mother cried when she saw it.",
      name: "Meher",
    },
    {
      quote:
        "Our office orders pastries here every Friday now. It genuinely changed the mood of the week.",
      name: "Vikram",
    },
    {
      quote: "Not too sweet, not too fussy. Just really, really good baking.",
      name: "Sara",
    },
  ],
};

export const contact = {
  eyebrow: "Contact",
  title: "Ready to take a pause?",
  body: "Tell us the occasion and the date. We'll take it from there — usually within a day.",
  // PLACEHOLDER — carried over from the draft site. Replace with the real number.
  phone: { label: "+91 98765 43210", href: "tel:+919876543210" },
  email: { label: "hello@takepause.in", href: "mailto:hello@takepause.in" },
  // PLACEHOLDER — the draft address is invented.
  address: ["24 Linden Lane, Indiranagar", "Bengaluru 560038"],
  hours: [
    { days: "Tuesday — Friday", time: "10am — 8pm" },
    { days: "Saturday — Sunday", time: "9am — 9pm" },
    { days: "Monday", time: "Closed" },
  ],
  // PLACEHOLDER — same number as above.
  whatsapp: {
    label: "WhatsApp Us",
    href: "https://wa.me/919876543210?text=Hi%20Take%20A%20Pause!%20I%27d%20like%20to%20place%20an%20order.",
  },
  instagram: { label: "@takepause.in", href: "https://www.instagram.com/takepause.in" },
};

export const footer = {
  line: "Made with love, one bake at a time.",
  copyright: `© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`,
};
