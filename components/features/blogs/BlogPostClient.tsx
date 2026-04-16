"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import type { BlogPost } from "@/lib/dataLoader";

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

type LayoutVariant = "cinematic" | "split" | "editorial" | "interwoven";
type ContentBlockType = "h1" | "h2" | "h3" | "li" | "p" | "divider";

interface ContentBlock {
  type: ContentBlockType;
  text: string;
}

function getLayoutVariant(slug: string): LayoutVariant {
  if (slug === "popular-2") {
    return "interwoven";
  }

  const hash = slug
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const variants: LayoutVariant[] = [
    "cinematic",
    "split",
    "editorial",
    "interwoven",
  ];
  return variants[hash % variants.length];
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function getInlineImageInsertions(blocks: ContentBlock[]): number[] {
  const candidates = blocks
    .map((block, index) => ({ block, index }))
    .filter(({ block }) => block.type === "p" || block.type === "h2");

  if (candidates.length < 2) {
    return [];
  }

  const totalWords = candidates.reduce(
    (sum, item) => sum + countWords(item.block.text),
    0,
  );

  // Keep image positions deterministic and content-aware by using word progress.
  const thresholds =
    totalWords >= 220 ? [Math.floor(totalWords * 0.35), Math.floor(totalWords * 0.72)] : [Math.floor(totalWords * 0.55)];

  const insertionIndices: number[] = [];
  let runningWords = 0;

  for (const { block, index } of candidates) {
    runningWords += countWords(block.text);

    if (
      insertionIndices.length < thresholds.length &&
      runningWords >= thresholds[insertionIndices.length]
    ) {
      // Insert after this block index.
      insertionIndices.push(index);
    }
  }

  return Array.from(new Set(insertionIndices));
}

function parseContentToBlocks(content?: string): ContentBlock[] {
  if (!content) {
    return [
      {
        type: "p",
        text: "This post is currently being written. Check back soon for the full article.",
      },
    ];
  }

  const lines = content.split("\n").map((line) => line.trim());
  const blocks: ContentBlock[] = [];

  for (const line of lines) {
    if (!line) continue;

    if (line.startsWith("\\#")) {
      blocks.push({ type: "p", text: line.slice(1).trim() });
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s*(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();

      if (level === 1) {
        blocks.push({ type: "h1", text });
      } else if (level === 2) {
        blocks.push({ type: "h2", text });
      } else {
        blocks.push({ type: "h3", text });
      }
      continue;
    }

    if (line === "---") {
      blocks.push({ type: "divider", text: "" });
      continue;
    }
    if (line.startsWith("- ")) {
      blocks.push({ type: "li", text: line.slice(2) });
      continue;
    }
    blocks.push({ type: "p", text: line });
  }

  return blocks;
}

function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.type === "divider") {
          return (
            <motion.div
              key={`d-${i}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="h-px bg-white/10 my-8"
            />
          );
        }

        const styles: Record<Exclude<ContentBlockType, "divider">, string> = {
          h1: "text-2xl md:text-3xl font-bold text-white mt-4",
          h2: "text-xl md:text-2xl font-semibold text-white mt-4",
          h3: "text-lg md:text-xl font-semibold text-white mt-2",
          li: "text-[16px] md:text-[17px] leading-relaxed text-white/80 ml-6 list-disc",
          p: "text-[16px] md:text-[17px] leading-relaxed text-white/72 font-light",
        };

        const Tag = block.type === "li" ? "li" : "p";

        if (block.type === "li") {
          return (
            <motion.ul
              key={`l-${i}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: i * 0.01 }}
              className="space-y-2"
            >
              <li className={styles.li}>{block.text}</li>
            </motion.ul>
          );
        }

        return (
          <motion.div
            key={`b-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.02 }}
          >
            <Tag className={styles[block.type]}>{block.text}</Tag>
          </motion.div>
        );
      })}
    </div>
  );
}

function InterwovenContentRenderer({
  blocks,
  post,
}: {
  blocks: ContentBlock[];
  post: BlogPost;
}) {
  const insertions = getInlineImageInsertions(blocks);

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const contentNode = (() => {
          if (block.type === "divider") {
            return (
              <motion.div
                key={`d-${i}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="h-px bg-white/10 my-8"
              />
            );
          }

          const styles: Record<Exclude<ContentBlockType, "divider">, string> = {
            h1: "text-2xl md:text-3xl font-bold text-white mt-4",
            h2: "text-xl md:text-2xl font-semibold text-white mt-4",
            h3: "text-lg md:text-xl font-semibold text-white mt-2",
            li: "text-[16px] md:text-[17px] leading-relaxed text-white/80 ml-6 list-disc",
            p: "text-[16px] md:text-[17px] leading-relaxed text-white/72 font-light",
          };

          const Tag = block.type === "li" ? "li" : "p";

          if (block.type === "li") {
            return (
              <motion.ul
                key={`l-${i}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: i * 0.01 }}
                className="space-y-2"
              >
                <li className={styles.li}>{block.text}</li>
              </motion.ul>
            );
          }

          return (
            <motion.div
              key={`b-${i}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.02 }}
            >
              <Tag className={styles[block.type]}>{block.text}</Tag>
            </motion.div>
          );
        })();

        if (!insertions.includes(i)) {
          return contentNode;
        }

        const imageOrder = insertions.indexOf(i);
        const alignClass = imageOrder % 2 === 0 ? "mr-auto" : "ml-auto";
        const imageHeight = imageOrder % 2 === 0 ? "h-[260px] sm:h-[320px]" : "h-[240px] sm:h-[300px]";

        return (
          <div key={`combo-${i}`} className="space-y-6">
            {contentNode}
            <motion.figure
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className={`relative w-full max-w-[680px] ${alignClass}`}
            >
              <div className={`relative ${imageHeight} rounded-[24px] overflow-hidden border border-white/10`}>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover grayscale brightness-60"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70 mb-1">
                    Visual Break
                  </p>
                  <p className="text-sm text-white/85 line-clamp-2">{post.title}</p>
                </div>
              </div>
            </motion.figure>
          </div>
        );
      })}
    </div>
  );
}

function MetaRow({ post }: { post: BlogPost }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="flex flex-wrap items-center gap-3 sm:gap-4 mt-5 text-sm text-white/55"
    >
      <span className="font-medium text-white/85">By {post.author}</span>
      <span className="w-px h-4 bg-white/20" />
      <span>{post.date}</span>
      <span className="w-px h-4 bg-white/20" />
      <span>{post.mins} min read</span>
    </motion.div>
  );
}

function RelatedCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/blogs/${post.slug}`} className="group block">
        <div className="bg-white rounded-[20px] p-[8px] flex flex-col gap-[8px] shadow-sm group-hover:shadow-md transition-shadow duration-300">
          <div className="relative rounded-[14px] overflow-hidden aspect-video w-full">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover grayscale brightness-60 group-hover:brightness-70 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h4 className="text-[13px] font-semibold leading-snug text-white line-clamp-2">
                {post.title}
              </h4>
            </div>
          </div>
          <div className="flex items-center justify-between px-1.5 pb-1 text-[11px] text-gray-400 italic">
            <span>{post.author}</span>
            <span>{post.mins} min read</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogPostClient({
  post,
  relatedPosts,
}: BlogPostClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const variant = getLayoutVariant(post.slug);
  const blocks = parseContentToBlocks(post.content);

  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const currentY = window.scrollY;
      const diff = currentY - lastY;

      if (currentY <= 20) {
        setIsHeaderVisible(true);
      } else if (diff > 6) {
        setIsHeaderVisible(false);
      } else if (diff < -6) {
        setIsHeaderVisible(true);
      }

      lastY = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-white">
      <Header
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
        hidden={!isHeaderVisible}
      />

      <motion.div
        animate={{
          y: menuOpen ? 100 : 0,
          scale: menuOpen ? 0.95 : 1,
          borderTopLeftRadius: menuOpen ? 24 : 0,
          borderTopRightRadius: menuOpen ? 24 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative origin-top overflow-hidden bg-black text-white min-h-screen"
        style={{ zIndex: 30 }}
      >
        {variant === "cinematic" && (
          <>
            <div className="relative w-full h-[55vh] min-h-[340px] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover grayscale brightness-50"
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black" />

              <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 lg:px-12 pb-10 max-w-[1431px] mx-auto">
                <div className="mb-3 pt-6 flex">
                  <Breadcrumbs
                    items={[
                      { label: "Home", href: "/" },
                      { label: "Blogs", href: "/blogs" },
                      { label: post.title },
                    ]}
                    variant="pill"
                    size="lg"
                  />
                </div>

                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="inline-block uppercase text-[10px] tracking-widest font-semibold text-white/40 mb-3"
                >
                  {post.category === "popular" ? "Popular" : "Newest"}
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] max-w-4xl"
                >
                  {post.title}
                </motion.h1>

                <MetaRow post={post} />
              </div>
            </div>

            <main className="px-5 sm:px-8 lg:px-12 max-w-[1431px] mx-auto py-16">
              <div className="flex flex-col lg:flex-row gap-16">
                <article className="flex-1 min-w-0">
                  <div className="max-w-[760px]">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                      className="origin-left h-px bg-white/10 mb-10"
                    />
                    <ContentRenderer blocks={blocks} />
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mt-14 pt-10 border-t border-white/10"
                    >
                      <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors group"
                      >
                        <span className="transform group-hover:-translate-x-1 transition-transform duration-200">
                          ←
                        </span>
                        Back to all blogs
                      </Link>
                    </motion.div>
                  </div>
                </article>

                {relatedPosts.length > 0 && (
                  <aside className="w-full lg:w-[320px] shrink-0">
                    <motion.div
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-6">
                        Related Posts
                      </h3>
                      <div className="space-y-5">
                        {relatedPosts.map((rp, i) => (
                          <RelatedCard key={rp.id} post={rp} index={i} />
                        ))}
                      </div>
                    </motion.div>
                  </aside>
                )}
              </div>
            </main>
          </>
        )}

        {variant === "split" && (
          <main className="px-5 sm:px-8 lg:px-12 max-w-[1431px] mx-auto py-10 sm:py-14">
            <div className="mb-8">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Blogs", href: "/blogs" },
                  { label: post.title },
                ]}
                variant="pill"
                size="lg"
              />
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-14">
              <div className="lg:col-span-5 flex flex-col justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="inline-block uppercase text-[10px] tracking-widest font-semibold text-white/45 mb-3"
                >
                  {post.category}
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.08]"
                >
                  {post.title}
                </motion.h1>
                <MetaRow post={post} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-7 relative rounded-[26px] overflow-hidden min-h-[280px] sm:min-h-[380px] border border-white/10"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover grayscale brightness-60"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              </motion.div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              {relatedPosts.length > 0 && (
                <aside className="lg:col-span-4 lg:order-1 order-2">
                  <div className="lg:sticky lg:top-28">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-6">
                      Related Posts
                    </h3>
                    <div className="space-y-5">
                      {relatedPosts.map((rp, i) => (
                        <RelatedCard key={rp.id} post={rp} index={i} />
                      ))}
                    </div>
                  </div>
                </aside>
              )}

              <article className="lg:col-span-8 lg:order-2 order-1">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.02] p-5 sm:p-8">
                  <ContentRenderer blocks={blocks} />
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-10"
                >
                  <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white/55 hover:text-white transition-colors group"
                  >
                    <span className="transform group-hover:-translate-x-1 transition-transform duration-200">
                      ←
                    </span>
                    Back to all blogs
                  </Link>
                </motion.div>
              </article>
            </section>
          </main>
        )}

        {variant === "editorial" && (
          <main className="px-5 sm:px-8 lg:px-12 max-w-[1431px] mx-auto py-10 sm:py-14">
            <div className="mb-8 flex justify-center lg:justify-start">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Blogs", href: "/blogs" },
                  { label: post.title },
                ]}
                variant="pill"
                size="lg"
              />
            </div>

            <section className="text-center max-w-4xl mx-auto mb-10">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="inline-block uppercase text-[10px] tracking-widest font-semibold text-white/40 mb-3"
              >
                {post.category}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08]"
              >
                {post.title}
              </motion.h1>
              <div className="flex justify-center">
                <MetaRow post={post} />
              </div>
            </section>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-[26px] overflow-hidden h-[36vh] sm:h-[48vh] min-h-[280px] max-w-5xl mx-auto border border-white/10 mb-14"
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover grayscale brightness-55"
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/15 via-black/10 to-black/45" />
            </motion.div>

            <article className="max-w-3xl mx-auto">
              <ContentRenderer blocks={blocks} />

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-12 pt-8 border-t border-white/10"
              >
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/55 hover:text-white transition-colors group"
                >
                  <span className="transform group-hover:-translate-x-1 transition-transform duration-200">
                    ←
                  </span>
                  Back to all blogs
                </Link>
              </motion.div>
            </article>

            {relatedPosts.length > 0 && (
              <section className="mt-16">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-6 text-center">
                  Related Posts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {relatedPosts.map((rp, i) => (
                    <RelatedCard key={rp.id} post={rp} index={i} />
                  ))}
                </div>
              </section>
            )}
          </main>
        )}

        {variant === "interwoven" && (
          <main className="px-5 sm:px-8 lg:px-12 max-w-[1431px] mx-auto py-10 sm:py-14">
            <div className="mb-8">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Blogs", href: "/blogs" },
                  { label: post.title },
                ]}
                variant="pill"
                size="lg"
              />
            </div>

            <section className="max-w-4xl mb-10">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="inline-block uppercase text-[10px] tracking-widest font-semibold text-white/40 mb-3"
              >
                {post.category}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08]"
              >
                {post.title}
              </motion.h1>
              <MetaRow post={post} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              <article className="lg:col-span-8">
                <InterwovenContentRenderer blocks={blocks} post={post} />

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-12 pt-8 border-t border-white/10"
                >
                  <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white/55 hover:text-white transition-colors group"
                  >
                    <span className="transform group-hover:-translate-x-1 transition-transform duration-200">
                      ←
                    </span>
                    Back to all blogs
                  </Link>
                </motion.div>
              </article>

              {relatedPosts.length > 0 && (
                <aside className="lg:col-span-4">
                  <div className="lg:sticky lg:top-28">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-6">
                      Related Posts
                    </h3>
                    <div className="space-y-5">
                      {relatedPosts.map((rp, i) => (
                        <RelatedCard key={rp.id} post={rp} index={i} />
                      ))}
                    </div>
                  </div>
                </aside>
              )}
            </section>
          </main>
        )}

        <div className="px-5 sm:px-8 lg:px-12 max-w-[1431px] mx-auto">
          <Footer />
        </div>
      </motion.div>
    </div>
  );
}
