import { story } from "@/config/copy";

export function Story() {
  const image = story.photo ?? story.illustration;

  return (
    <section
      id="story"
      aria-labelledby="story-title"
      className="section bg-cream"
    >
      <div className="shell grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-center lg:gap-20">
        <figure className="relative mx-auto w-full max-w-[24rem] md:max-w-none">
          <div className="overflow-hidden rounded-t-full rounded-b-[2rem] border border-cocoa/15 bg-rose-soft">
            <img
              src={image.src}
              alt={image.alt}
              width={960}
              height={1200}
              loading="lazy"
              className="block aspect-[4/5] w-full object-cover"
            />
          </div>
          <div
            className="checker absolute -bottom-4 left-8 w-24 [--checker-size:10px]"
            aria-hidden="true"
          />
        </figure>

        <div>
          <p className="eyebrow">{story.eyebrow}</p>
          <h2 id="story-title" className="display-lg mt-4 max-w-[14ch]">
            {story.title}
          </h2>
          <div className="mt-6 max-w-[36rem] space-y-4">
            {story.paragraphs.map((p) => (
              <p key={p} className="lede text-cocoa">
                {p}
              </p>
            ))}
          </div>
          <p className="mt-8 font-script text-[2.1rem] leading-none text-cherry">
            {story.signature}
          </p>
        </div>
      </div>
    </section>
  );
}
