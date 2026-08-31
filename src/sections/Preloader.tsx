import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Logo } from "@/components/Logo";

/**
 * A held beat before the site arrives. The whole premise of the brand is
 * slowing down, so the page earns about two seconds of stillness first.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(!reduced);

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setOpen(false), 1900);
    return () => clearTimeout(t);
  }, [reduced, onDone]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
        onDone();
      }}
    >
      {open && (
        <motion.div
          key="preloader"
          className="u-grain fixed inset-0 z-100 flex items-center justify-center bg-cream"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Logo size="lg" />
          </motion.div>

          {/* A hairline that draws itself across, like a slow breath. */}
          <motion.span
            className="absolute bottom-[22%] h-px bg-ink/25"
            initial={{ width: 0 }}
            animate={{ width: "min(38vw, 18rem)" }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
