"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import type { BlogPost } from "@/lib/dataLoader";

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -6 }}
    >
      <Link href={`/blogs/${post.slug}`} className="group block">
        <div className="bg-white/95 rounded-[24px] p-3 flex flex-col gap-3 shadow-[0_10px_35px_rgba(0,0,0,0.2)] group-hover:shadow-[0_22px_52px_rgba(0,0,0,0.32)] transition-all duration-300 border border-white/30">
          <div className="relative rounded-[18px] overflow-hidden aspect-4/3 w-full">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover grayscale brightness-65 scale-[1.02] group-hover:scale-[1.07] group-hover:brightness-75 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center rounded-full bg-white/90 text-black text-[11px] font-semibold px-3 py-1 tracking-[0.06em] uppercase">
                {post.category}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-[15px] font-semibold leading-snug text-white mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-[13px] text-white/70 font-light">
                By {post.author}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 pb-1 text-[12px] text-gray-500">
            <span className="rounded-full bg-black/5 px-2.5 py-1 font-medium">
              {post.mins} min read
            </span>
            <span>{post.date}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SectionLabel({ label, delay = 0 }: { label: string; delay?: number }) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="inline-flex items-center text-xl sm:text-2xl md:text-3xl font-bold italic text-white mb-8 gap-3"
    >
      <span className="h-[1px] w-10 bg-white/40" />
      {label}
    </motion.h2>
  );
}

interface BlogsClientProps {
  popularPosts: BlogPost[];
  newestPosts: BlogPost[];
}

export default function BlogsClient({
  popularPosts,
  newestPosts,
}: BlogsClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [sectionsConfig, setSectionsConfig] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/admin/sections");
        const data = await res.json();
        const blogsConfig = data.sections?.find((s: any) => s.id === "blogs");
        if (blogsConfig && !blogsConfig.enabled) {
          setIsDisabled(true);
        }
        if (data?.sections) {
          const configMap: Record<string, boolean> = {};
          data.sections.forEach((s: any) => {
            configMap[s.id] = s.enabled;
          });
          setSectionsConfig(configMap);
        }
      } catch (err) {
        // Ignore
      }
    }
    fetchConfig();
  }, []);

  if (isDisabled) {
    return (
      <div className="relative min-h-screen bg-white">
        <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} />
        <div className="flex min-h-[70vh] items-center justify-center bg-black text-white px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Section Disabled</h1>
            <p className="text-gray-400">This page is currently unavailable.</p>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 -right-28 h-72 w-72 rounded-full bg-white/8 blur-3xl" />
          <div className="absolute top-[38%] -left-28 h-64 w-64 rounded-full bg-white/8 blur-3xl" />
          <div className="absolute bottom-0 right-[16%] h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        </div>

        <main className="relative pt-24 sm:pt-28 pb-20 sm:pb-24 px-5 sm:px-8 lg:px-12 max-w-[1431px] mx-auto">
          {/* Breadcrumb */}
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Blogs" }]}
            variant="pill"
            size="lg"
            className="mb-8"
          />

          {/* Page Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4"
          >
            Blogs
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-white/70 text-sm sm:text-base whitespace-nowrap mx-auto mb-12 sm:mb-14"
          >
            Sharp ideas, practical playbooks, and stories from the teams building
            standout digital experiences.
          </motion.p>

          {/* ── Popular ─────────────────────────────────────────────────────── */}
          {sectionsConfig["blog-popular"] !== false && (
            <section className="mb-16">
              <SectionLabel label="Popular" />
              <div className="max-w-[1251px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
                {popularPosts.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Divider */}
          <div className="max-w-[1251px] border-t border-white/15 mb-16" />

          {/* ── Newest ──────────────────────────────────────────────────────── */}
          {sectionsConfig["blog-newest"] !== false && (
            <section>
              <SectionLabel label="Newest" delay={0.1} />
              <div className="max-w-[1251px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
                {newestPosts.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </section>
          )}
        </main>

        <div className="px-5 sm:px-8 lg:px-12 max-w-[1431px] mx-auto">
          <Footer />
        </div>
      </motion.div>
    </div>
  );
}
