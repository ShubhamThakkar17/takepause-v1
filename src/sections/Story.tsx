import { motion } from "motion/react";
import { Float, Parallax, Reveal, SplitWords } from "@/components/Motion";
import { ease } from "@/lib/motion";
import { story } from "@/config/copy";

export function Story() {
  const photo = story.photo;
  const image = photo ?? story.illustration;

  return (
    <section
      id="story"
      aria-labelledby="story-title"
      className="section overflow-hidden bg-cream"
    >
      <div className="shell grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:items-center lg:gap-20">
        {/* The figure triggers the reveal: a fully clipped child can't
            report itself as visible, so it can't start its own. */}
        <motion.figure
          className="relative mx-auto w-full max-w-[24rem] md:max-w-none"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Offset frame that settles into place behind the photo. */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-t-full rounded-b-[2rem] bg-rose"
            variants={{
              hidden: { x: 0, y: 0, rotate: 0 },
              show: {
                x: -14,
                y: 14,
                rotate: -3,
                transition: { duration: 1.2, ease, delay: 0.3 },
              },
            }}
          />
          <motion.div
            className="group relative overflow-hidden rounded-t-full rounded-b-[2rem] border border-cocoa/15 bg-rose-soft"
            variants={{
              hidden: { clipPath: "inset(100% 0% 0% 0%)" },
              show: {
                clipPath: "inset(0% 0% 0% 0%)",
                transition: { duration: 1.3, ease },
              },
            }}
          >
            <Parallax distance={24}>
              <motion.img
                src={image.src}
                srcSet={
                  photo?.srcSmall
                    ? `${photo.srcSmall} 480w, ${photo.src} 960w`
                    : undefined
                }
                sizes="(min-width: 768px) 40vw, 24rem"
                alt={image.alt}
                width={960}
                height={1200}
                loading="lazy"
                className="block aspect-[4/5] w-full object-cover"
                variants={{
                  hidden: { scale: 1.3 },
                  show: { scale: 1.1, transition: { duration: 1.8, ease } },
                }}
                whileHover={{
                  scale: 1.16,
                  transition: { duration: 0.8, ease },
                }}
              />
            </Parallax>
          </motion.div>

          {photo && (
            <motion.div
              className="absolute -right-2 bottom-10 sm:-right-6"
              variants={{
                hidden: { scale: 0, rotate: -30 },
                show: {
                  scale: 1,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                    delay: 0.9,
                  },
                },
              }}
            >
              <Float y={8} rotate={4} duration={4.5}>
                <figcaption className="rotate-[-6deg] rounded-full bg-cherry px-5 py-2.5 font-script text-[1.6rem] leading-none text-cream shadow-[0_12px_28px_-14px_rgba(142,41,56,0.9)]">
                  {story.sticker}
                </figcaption>
              </Float>
            </motion.div>
          )}

          <div
            className="checker checker-slide absolute -bottom-4 left-8 w-24 [--checker-size:10px]"
            aria-hidden="true"
          />
        </motion.figure>

        <div>
          <Reveal y={16}>
            <p className="eyebrow">{story.eyebrow}</p>
          </Reveal>
          <h2 id="story-title" className="display-lg mt-4 max-w-[14ch]">
            <SplitWords text={story.title} />
          </h2>
          <div className="mt-6 max-w-[36rem] space-y-4">
            {story.paragraphs.map((p, i) => (
              <Reveal key={p} delay={0.15 + i * 0.12}>
                <p className="lede text-cocoa">{p}</p>
              </Reveal>
            ))}
          </div>
          {/* The signature writes itself in, left to right. */}
          <motion.div
            className="mt-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 1 }}
          >
            <motion.p
              className="inline-block font-script text-[2.3rem] leading-tight text-cherry"
              variants={{
                hidden: { clipPath: "inset(0% 100% 0% 0%)" },
                show: {
                  clipPath: "inset(0% 0% 0% 0%)",
                  transition: { duration: 1.6, ease: "easeInOut", delay: 0.3 },
                },
              }}
            >
              {story.signature}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
