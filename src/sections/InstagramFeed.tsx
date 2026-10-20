import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Instagram } from "@/components/Icons";
import { Reveal, SplitWords } from "@/components/Motion";
import { rise, stagger } from "@/lib/motion";
import { instagramSection } from "@/config/copy";
import { contact, instagramFeed, links } from "@/config/site";
import { buttonSecondary } from "@/lib/ui";

type Post = { id: string; href: string; image: string; caption: string };

/**
 * Reads a JSON feed of recent posts. Built for Behold's feed format, and
 * tolerant of plain arrays of Instagram Graph API media objects.
 */
function normalise(json: unknown): Post[] {
  const list = Array.isArray(json)
    ? json
    : ((json as { posts?: unknown[] })?.posts ?? []);
  return list
    .map((raw) => {
      const p = raw as Record<string, unknown> & {
        sizes?: Record<string, { mediaUrl?: string }>;
      };
      const isVideo = p.mediaType === "VIDEO" || p.media_type === "VIDEO";
      const image =
        p.sizes?.medium?.mediaUrl ??
        p.sizes?.small?.mediaUrl ??
        (isVideo
          ? (p.thumbnailUrl ?? p.thumbnail_url)
          : (p.mediaUrl ?? p.media_url));
      return {
        id: String(p.id ?? image),
        href: String(p.permalink ?? links.instagram ?? ""),
        image: typeof image === "string" ? image : "",
        caption: String(p.prunedCaption ?? p.caption ?? "").slice(0, 140),
      };
    })
    .filter((p) => p.image && p.href)
    .slice(0, instagramFeed.limit);
}

export function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!instagramFeed.url) return;
    const controller = new AbortController();
    fetch(instagramFeed.url, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => setPosts(normalise(json)))
      .catch(() => setPosts([])); // Quietly fall back to the profile link.
    return () => controller.abort();
  }, []);

  if (!links.instagram) return null;

  return (
    <section aria-labelledby="instagram-title" className="section bg-cream">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal y={16}>
              <p className="eyebrow">{instagramSection.eyebrow}</p>
            </Reveal>
            <h2 id="instagram-title" className="display-lg mt-4">
              <SplitWords text={instagramSection.title} />
            </h2>
            <p className="lede mt-4 max-w-[34rem]">{instagramSection.body}</p>
          </div>
          <a
            href={links.instagram}
            target="_blank"
            rel="noreferrer noopener"
            className={`${buttonSecondary} self-start md:self-auto`}
          >
            <Instagram /> @{contact.instagram}
          </a>
        </div>

        {posts.length > 0 ? (
          <motion.ul
            className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {posts.map((post) => (
              <motion.li key={post.id} variants={rise}>
                <a
                  href={post.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group block overflow-hidden rounded-2xl border border-cocoa/15 bg-rose-soft"
                >
                  <img
                    src={post.image}
                    alt={
                      post.caption
                        ? `Instagram post: ${post.caption}`
                        : "Instagram post from Take Pause"
                    }
                    width={400}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />
                </a>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.a
            href={links.instagram}
            target="_blank"
            rel="noreferrer noopener"
            className="group mt-10 grid overflow-hidden rounded-[2rem] border border-cocoa/15 bg-rose-soft transition-[box-shadow,background-color] duration-500 hover:bg-rose hover:shadow-[0_20px_40px_-24px_rgba(56,35,30,0.5)] sm:grid-cols-[auto_1fr] sm:items-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="checker checker-slide h-full min-h-7 w-full sm:min-h-0 sm:w-14 [--checker-color:var(--color-cherry)] [--checker-size:14px]"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
              <p className="font-display text-[clamp(1.6rem,4vw,2.5rem)] leading-tight">
                See the latest bakes on Instagram
              </p>
              <p className="font-semibold text-cherry underline decoration-cherry/40 decoration-2 underline-offset-4 group-hover:decoration-cherry">
                instagram.com/{contact.instagram}
              </p>
            </div>
          </motion.a>
        )}
      </div>
    </section>
  );
}
