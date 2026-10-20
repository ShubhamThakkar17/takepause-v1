/**
 * The menu, transcribed from the printed Take Pause menu (Sept 2026).
 *
 * Exact prices are kept here so the ranges stay accurate, but the site only
 * ever shows a starting point or a range — see `priceDisplay` below.
 *
 * To change the menu: edit the items here. Categories, filters, the enquiry
 * form's product list and the price ranges all update from this file.
 *
 * Images: every bake points at an illustration in /public/images/bakes. To
 * use real photos, drop them in the same folder (around 1200×900, 4:3) and
 * change `src` — set `kind: "photo"` so they fill the frame edge to edge.
 */

/** How prices appear on the site: "onwards" → ₹700 onwards, "range" → ₹700–₹950, "plus" → ₹700+ */
export const priceDisplay: "onwards" | "range" | "plus" = "onwards";

export type FilterId =
  | "cheesecakes"
  | "cookies"
  | "brownies"
  | "cakes"
  | "extras";

export const filters: { id: FilterId | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "cheesecakes", label: "Cheesecakes" },
  { id: "cookies", label: "Cookies" },
  { id: "brownies", label: "Brownies" },
  { id: "cakes", label: "Cakes & cupcakes" },
  { id: "extras", label: "Tubs & boxes" },
];

export type BakeImage = {
  src: string;
  alt: string;
  /** Illustrations sit inside the frame; photos fill it. */
  kind: "illustration" | "photo";
};

export type Flavour = { name: string; price: number | null };

export type Bake = {
  id: string;
  name: string;
  filter: FilterId;
  /** Portion the price refers to, e.g. "500 g" or "Box of 6". */
  size: string;
  blurb: string;
  image: BakeImage;
  flavours: Flavour[];
  /** Optional extras ordered alongside, priced separately. */
  addOns?: { label: string; items: Flavour[] };
  /** Overrides the computed price, for items priced on request. */
  priceLabel?: string;
};

const sponges = {
  vanillaButtercream: "Vanilla sponge, filling of choice, buttercream",
  vanillaGanache: "Vanilla sponge, filling of choice, chocolate ganache",
  chocolateButtercream: "Chocolate sponge, filling of choice, buttercream",
  chocolateGanache: "Chocolate sponge, filling of choice, chocolate ganache",
  redVelvet: "Red velvet sponge, cream cheese frosting",
  redVelvetNutty: "Red velvet sponge, nutty filling, cream cheese frosting",
};

export const bakes: Bake[] = [
  {
    id: "cheesecake",
    name: "Cheesecakes",
    filter: "cheesecakes",
    size: "500 g",
    blurb:
      "Creamy, generous and made to share — from double chocolate to pistachio kunafa.",
    image: {
      src: "/images/bakes/cheesecake.svg",
      alt: "Illustration of a cheesecake slice topped with strawberries",
      kind: "illustration",
    },
    flavours: [
      { name: "Double Chocolate", price: 700 },
      { name: "Blueberry", price: 750 },
      { name: "Strawberry", price: 750 },
      { name: "Pistachio Strawberry", price: 850 },
      { name: "Nutella Hazelnut", price: 850 },
      { name: "Lotus Biscoff", price: 900 },
      { name: "Chocolate Pistachio Kunafa", price: 950 },
    ],
  },
  {
    id: "cookies",
    name: "Cookies",
    filter: "cookies",
    size: "Box of 6",
    blurb:
      "A box of six, from the NYC classic to red velvet with cream cheese.",
    image: {
      src: "/images/bakes/cookies.svg",
      alt: "Illustration of a stack of chocolate chunk cookies",
      kind: "illustration",
    },
    flavours: [
      { name: "NYC Classic", price: 450 },
      { name: "Chocolate Brookie", price: 460 },
      { name: "Lemon Blueberry", price: 480 },
      { name: "Red Velvet", price: 500 },
      { name: "Nutella Drizzle", price: 550 },
      { name: "Biscoff Drizzle", price: 550 },
      { name: "Red Velvet + Cream Cheese", price: 580 },
    ],
  },
  {
    id: "brownies",
    name: "Brownies",
    filter: "brownies",
    size: "Box of 4",
    blurb: "Four fudgy squares — keep them classic or add a topping.",
    image: {
      src: "/images/bakes/brownies.svg",
      alt: "Illustration of stacked chocolate brownies with a crackled top",
      kind: "illustration",
    },
    flavours: [
      { name: "Classic Fudgy", price: 400 },
      { name: "Chocolate Walnut", price: 450 },
      { name: "Red Velvet Brownie", price: 480 },
    ],
    addOns: {
      label: "Extra toppings",
      items: [
        { name: "Nutella", price: 100 },
        { name: "Biscoff", price: 120 },
        { name: "Pistachio Kunafa", price: 150 },
        { name: "Cream Cheese", price: 150 },
      ],
    },
  },
  {
    id: "cake",
    name: "Make-your-own cake",
    filter: "cakes",
    size: "500 g",
    blurb:
      "Pick a sponge, a filling and a frosting. Custom designs are available.",
    image: {
      src: "/images/bakes/cake.svg",
      alt: "Illustration of a layer cake with piped buttercream and a cherry",
      kind: "illustration",
    },
    flavours: [
      { name: sponges.vanillaButtercream, price: 600 },
      { name: sponges.chocolateButtercream, price: 650 },
      { name: sponges.vanillaGanache, price: 700 },
      { name: sponges.chocolateGanache, price: 750 },
      { name: sponges.redVelvet, price: 850 },
      { name: sponges.redVelvetNutty, price: 900 },
    ],
  },
  {
    id: "cupcakes",
    name: "Cupcakes",
    filter: "cakes",
    size: "Box of 6",
    blurb:
      "The same sponges, fillings and frostings as our cakes, in a box of six.",
    image: {
      src: "/images/bakes/cupcakes.svg",
      alt: "Illustration of two cupcakes with swirled frosting",
      kind: "illustration",
    },
    flavours: [
      { name: sponges.vanillaButtercream, price: 450 },
      { name: sponges.chocolateButtercream, price: 500 },
      { name: sponges.vanillaGanache, price: 550 },
      { name: sponges.chocolateGanache, price: 600 },
      { name: sponges.redVelvet, price: 650 },
      { name: sponges.redVelvetNutty, price: 700 },
    ],
  },
  {
    id: "cheesecake-tub",
    name: "Cheesecake tubs",
    filter: "extras",
    size: "250 ml · 300 ml · 450 ml",
    blurb: "Cheesecake by the spoonful, in three tub sizes.",
    image: {
      src: "/images/bakes/tub.svg",
      alt: "Illustration of a cheesecake tub with a spoon",
      kind: "illustration",
    },
    flavours: [
      { name: "250 ml tub", price: 280 },
      { name: "300 ml tub", price: 350 },
      { name: "450 ml tub", price: 480 },
    ],
  },
  {
    id: "assorted-box",
    name: "Assorted box",
    filter: "extras",
    size: "Box of 6",
    blurb: "Can't choose? A mixed box of six brownies or cookies.",
    image: {
      src: "/images/bakes/box.svg",
      alt: "Illustration of an open box of assorted cookies and brownies",
      kind: "illustration",
    },
    flavours: [
      { name: "Assorted brownies", price: 650 },
      { name: "Assorted cookies", price: 650 },
    ],
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    filter: "extras",
    size: "On special order",
    blurb: "Available on special order — ask us for sizes and dates.",
    image: {
      src: "/images/bakes/tiramisu.svg",
      alt: "Illustration of layered tiramisu dusted with cocoa",
      kind: "illustration",
    },
    flavours: [],
    priceLabel: "Price on request",
  },
];

/** Shown in the make-your-own feature and offered in the enquiry form. */
export const cakeBuilder = {
  sponges: ["Vanilla", "Chocolate", "Red velvet"],
  fillings: [
    "Strawberry",
    "Lemon-blueberry",
    "Orange",
    "Pineapple",
    "Roasted almonds",
    "Pistachios",
    "Roasted hazelnuts",
    "Nutella",
    "Biscoff",
    "Pistachio kunafa",
  ],
  frostings: [
    "White chocolate ganache",
    "Milk chocolate ganache",
    "Dark chocolate ganache",
    "Buttercream",
  ],
  /** Red velvet comes with cream cheese frosting. */
  note: "Red velvet is paired with cream cheese frosting.",
};

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** The price line for a bake, in the style set by {@link priceDisplay}. */
export function priceFor(bake: Bake): string | null {
  if (bake.priceLabel) return bake.priceLabel;
  const prices = bake.flavours
    .map((f) => f.price)
    .filter((p): p is number => p !== null);
  if (!prices.length) return null;
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  if (priceDisplay === "range" && high > low)
    return `${rupees(low)}–${rupees(high)}`;
  if (priceDisplay === "plus") return `${rupees(low)}+`;
  return `${rupees(low)} onwards`;
}

/** "from ₹100" style line for add-ons. */
export function addOnPrice(items: Flavour[]): string | null {
  const prices = items
    .map((f) => f.price)
    .filter((p): p is number => p !== null);
  return prices.length ? `from ${rupees(Math.min(...prices))}` : null;
}
