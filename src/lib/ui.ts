/** Shared class strings, so every button on the site behaves the same way. */

const button =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-[0.975rem] font-semibold leading-tight transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

export const buttonPrimary = `${button} bg-cherry text-cream hover:bg-cherry-deep focus-visible:outline-cocoa`;

export const buttonSecondary = `${button} border-2 border-cherry text-cherry hover:bg-cherry hover:text-cream`;

export const buttonQuiet = `${button} border border-cocoa/25 bg-cream text-cocoa hover:border-cocoa`;

export const textLink =
  "font-semibold text-cherry underline decoration-cherry/40 decoration-2 underline-offset-4 hover:decoration-cherry";

/** For the rare button that sits on a cherry ground. */
export const buttonOnCherry = `${button} bg-cream text-cherry hover:bg-rose focus-visible:outline-cream`;

/** Compact primary button for the header. */
export const buttonPrimaryCompact =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-cherry px-4 py-2.5 text-[0.9rem] font-semibold leading-tight text-cream transition-colors duration-200 hover:bg-cherry-deep focus-visible:outline-cocoa sm:px-6 sm:text-[0.975rem]";
