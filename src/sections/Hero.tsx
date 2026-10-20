import { useRef } from "react";
import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowRight, Pin } from "@/components/Icons";
import { Float, SplitWords } from "@/components/Motion";
import { ease } from "@/lib/motion";
import { hero } from "@/config/copy";
import { policies } from "@/config/site";
import { useEnquiry } from "@/lib/enquiryContext";
import { arrowNudge, buttonPrimary, buttonSecondary } from "@/lib/ui";

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

export function Hero() {
  const openEnquiry = useEnquiry();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // As the hero scrolls away, the cake sinks slowly and the copy drifts up.
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [0, 120],
  );
  const copyY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [0, -60],
  );
  const stampRotate = useTransform(scrollYProgress, [0, 1], [0, 140]);

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden"
    >
      <div className="shell grid items-center gap-10 pt-8 pb-16 md:pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pt-16 lg:pb-24">
        <motion.div className="max-w-[40rem]" style={{ y: copyY }}>
          <motion.p
            {...enter(0)}
            className="inline-flex items-center gap-2 rounded-full border border-cocoa/20 bg-white/60 py-1.5 pr-4 pl-3 text-[0.9rem] font-medium"
          >
            <motion.span
              animate={reduce ? undefined : { y: [0, -3, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-flex"
            >
              <Pin width={17} height={17} className="text-cherry" />
            </motion.span>
            {hero.location}
          </motion.p>

          <h1 id="hero-title" className="display-xl mt-6 md:mt-8">
            <SplitWords
              text={hero.title[0]}
              className="block"
              onMount
              delay={0.15}
            />
            <SplitWords
              text={hero.title[1]}
              className="block text-cherry italic"
              onMount
              delay={0.45}
            />
          </h1>

          <motion.p {...enter(0.8)} className="lede mt-6 max-w-[32rem] md:mt-8">
            {hero.body}
          </motion.p>

          <motion.div
            {...enter(0.95)}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <a href="#bakes" className={buttonPrimary}>
              {hero.primary}{" "}
              <ArrowRight width={18} height={18} className={arrowNudge} />
            </a>
            <button
              type="button"
              onClick={() => openEnquiry()}
              className={buttonSecondary}
            >
              {hero.secondary}
            </button>
          </motion.div>

          <motion.ul
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] text-cocoa-soft"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.12, delayChildren: 1.1 },
              },
            }}
          >
            {["Eggless", "Made to order", policies.leadTimeShort].map(
              (item) => (
                <motion.li
                  key={item}
                  className="flex items-center gap-2"
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                  }}
                >
                  <span
                    className="size-1.5 rounded-full bg-cherry"
                    aria-hidden="true"
                  />
                  {item}
                </motion.li>
              ),
            )}
          </motion.ul>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-[30rem] lg:max-w-none"
          style={{ y: imageY }}
        >
          {/* An offset outline, like a slightly misregistered print. */}
          <motion.div
            className="absolute inset-0 rounded-t-full border-2 border-cherry"
            aria-hidden="true"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, x: 14, y: 14 }}
            transition={{ duration: 1, ease, delay: 0.9 }}
          />
          <motion.div
            className="group relative overflow-hidden rounded-t-full border border-cocoa/15 bg-rose"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.2, ease, delay: 0.2 }}
          >
            <motion.img
              src={hero.image.src}
              alt={hero.image.alt}
              width={hero.image.width}
              height={hero.image.height}
              fetchPriority="high"
              className="block h-auto w-full"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 1.6, ease, delay: 0.2 }}
            />
          </motion.div>

          {/* Floating accents around the arch. */}
          <Float
            className="pointer-events-none absolute -top-3 right-6 sm:right-10"
            y={12}
            rotate={8}
            duration={4.5}
          >
            <Sparkle className="size-9 text-cherry" />
          </Float>
          <Float
            className="pointer-events-none absolute top-1/3 -right-3 sm:-right-6"
            y={16}
            rotate={-10}
            duration={6}
            delay={0.8}
          >
            <Cherry className="size-12" />
          </Float>
          <Float
            className="pointer-events-none absolute top-24 -left-4 hidden sm:block"
            y={10}
            rotate={12}
            duration={5.5}
            delay={1.4}
          >
            <Sparkle className="size-6 text-pistachio" />
          </Float>

          <motion.div
            className="absolute -bottom-6 -left-3 sm:-left-8"
            initial={{ scale: 0, rotate: -60 }}
            animate={{ scale: 1, rotate: -10 }}
            transition={{
              type: "spring",
              stiffness: 160,
              damping: 12,
              delay: 1.2,
            }}
            aria-hidden="true"
          >
            <EgglessBadge rotate={stampRotate} reduce={Boolean(reduce)} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/** "100% eggless" with a ring of text that turns slowly, and faster as you scroll. */
function EgglessBadge({
  rotate,
  reduce,
}: {
  rotate: MotionValue<number>;
  reduce: boolean;
}) {
  const ring = "eggless · homemade · vadodara · ";
  return (
    <div className="relative flex size-32 items-center justify-center rounded-full bg-pistachio text-cream shadow-[0_14px_30px_-14px_rgba(31,91,58,0.8)] sm:size-36">
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
        style={{ rotate: reduce ? 0 : rotate }}
      >
        <motion.g
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ originX: "50px", originY: "50px" }}
        >
          <defs>
            <path
              id="badge-ring"
              d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0"
            />
          </defs>
          <text
            fill="currentColor"
            fontSize="8"
            fontWeight="600"
            letterSpacing="1.9"
            style={{
              textTransform: "uppercase",
              fontFamily: "var(--font-sans)",
            }}
          >
            <textPath href="#badge-ring">{ring}</textPath>
          </text>
        </motion.g>
      </motion.svg>
      <div className="flex flex-col items-center leading-none">
        <span className="font-display text-[1.25rem] font-semibold sm:text-[1.4rem]">
          {hero.stamp[0]}
        </span>
        <span className="font-script text-[1.05rem] sm:text-[1.2rem]">
          {hero.stamp[1]}
        </span>
      </div>
    </div>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 0c.6 5.8 2.9 9 12 12-9.1 3-11.4 6.2-12 12-.6-5.8-2.9-9-12-12C9.1 9 11.4 5.8 12 0z"
      />
    </svg>
  );
}

function Cherry({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 8c-2 8-8 14-12 20M24 8c2 7 6 12 12 16"
        fill="none"
        stroke="#38231E"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M24 8c4-4 10-4 13-1-4 3-9 3-13 1z"
        fill="#4F8A52"
        stroke="#38231E"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="34"
        r="8"
        fill="#8E2938"
        stroke="#38231E"
        strokeWidth="2.4"
      />
      <circle
        cx="36"
        cy="30"
        r="8"
        fill="#8E2938"
        stroke="#38231E"
        strokeWidth="2.4"
      />
      <path
        d="M8 31q1-3 4-3.5M32 27q1-3 4-3.5"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".7"
        fill="none"
      />
    </svg>
  );
}
