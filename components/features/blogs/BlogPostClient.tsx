"use client";

import { useState } from "react";
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

function getPostImages(post: BlogPost): string[] {
  return (post.images || [])
    .map((img) => (typeof img === "string" ? img.trim() : ""))
    .filter(Boolean);
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

function renderContentBlock(block: ContentBlock, index: number) {
  if (block.type === "divider") {
    return (
      <motion.div
        key={`d-${index}`}
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
        key={`l-${index}`}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.45, delay: index * 0.01 }}
        className="space-y-2"
      >
        <li className={styles.li}>{block.text}</li>
      </motion.ul>
    );
  }

  return (
    <motion.div
      key={`b-${index}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.02 }}
    >
      <Tag className={styles[block.type]}>{block.text}</Tag>
    </motion.div>
  );
}

function GalleryImageFigure({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  index: number;
}) {
  return (
    <motion.figure
      key={`g-${index}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: 0.05 }}
      className="relative w-full my-8"
    >
      <div className="relative w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] aspect-[16/10] sm:aspect-[16/9]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-center"
        />
      </div>
    </motion.figure>
  );
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

function ContentRenderer({
  blocks,
  galleryImages = [],
  altText,
}: {
  blocks: ContentBlock[];
  galleryImages?: string[];
  altText: string;
}) {
  const paragraphIndexes = blocks
    .map((block, index) => ({ block, index }))
    .filter(({ block }) => block.type === "p")
    .map(({ index }) => index);

  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        const nodes = [renderContentBlock(block, index)];

        if (block.type === "p" && galleryImages.length > 0 && paragraphIndexes.includes(index)) {
          const imageIndex = paragraphIndexes.indexOf(index);
          if (imageIndex < galleryImages.length) {
            nodes.push(
              <GalleryImageFigure
                key={`g-${index}`}
                src={galleryImages[imageIndex]}
                alt={altText}
                index={imageIndex}
              />,
            );
          }
        }

        return nodes;
      })}

      {galleryImages.length > paragraphIndexes.length &&
        galleryImages.slice(paragraphIndexes.length).map((src, index) => (
          <GalleryImageFigure
            key={`g-bottom-${index}`}
            src={src}
            alt={altText}
            index={paragraphIndexes.length + index}
          />
        ))}
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
              className="object-contain object-center"
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
  const variant = getLayoutVariant(post.slug);
  const blocks = parseContentToBlocks(post.content);
  const coverImage = post.image;
  const galleryImages = getPostImages(post);

  return (
    <div className="relative min-h-screen bg-white">
      <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} />

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
                src={coverImage}
                alt={post.title}
                fill
                priority
                className="object-contain object-center"
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
                    <ContentRenderer
                      blocks={blocks}
                      galleryImages={galleryImages}
                      altText={post.title}
                    />
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
                  src={coverImage}
                  alt={post.title}
                  fill
                  priority
                  className="object-contain object-center"
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
                  <ContentRenderer
                    blocks={blocks}
                    galleryImages={galleryImages}
                    altText={post.title}
                  />
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
                src={coverImage}
                alt={post.title}
                fill
                priority
                className="object-contain object-center"
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/15 via-black/10 to-black/45" />
            </motion.div>


            <article className="max-w-3xl mx-auto">
              <ContentRenderer
                blocks={blocks}
                galleryImages={galleryImages}
                altText={post.title}
              />

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
              <div className="lg:col-span-12">
              </div>
              <article className="lg:col-span-8">
                <ContentRenderer
                  blocks={blocks}
                  galleryImages={galleryImages}
                  altText={post.title}
                />

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
