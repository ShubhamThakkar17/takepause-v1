/** Shared class strings, so every button on the site behaves the same way. */

// Buttons lift a touch on hover and press down on click.
const motion =
  "transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]";

const button = `group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-[0.975rem] font-semibold leading-tight disabled:cursor-not-allowed disabled:opacity-60 ${motion}`;

export const buttonPrimary = `${button} bg-cherry text-cream hover:bg-cherry-deep hover:shadow-[0_10px_24px_-10px_rgba(142,41,56,0.75)] focus-visible:outline-cocoa`;

export const buttonSecondary = `${button} border-2 border-cherry text-cherry hover:bg-cherry hover:text-cream`;

export const buttonQuiet = `${button} border border-cocoa/25 bg-cream text-cocoa hover:border-cocoa`;

export const textLink =
  "font-semibold text-cherry underline decoration-cherry/40 decoration-2 underline-offset-4 hover:decoration-cherry";

/** For the rare button that sits on a cherry ground. */
export const buttonOnCherry = `${button} bg-cream text-cherry hover:bg-rose focus-visible:outline-cream`;

/** Compact primary button for the header. */
export const buttonPrimaryCompact = `inline-flex min-h-11 items-center justify-center rounded-full bg-cherry px-4 py-2.5 text-[0.9rem] font-semibold leading-tight text-cream hover:bg-cherry-deep hover:shadow-[0_10px_24px_-10px_rgba(142,41,56,0.75)] focus-visible:outline-cocoa sm:px-6 sm:text-[0.975rem] ${motion}`;

/** The arrow inside a button nudges forward on hover. */
export const arrowNudge =
  "transition-transform duration-300 group-hover:translate-x-1";
