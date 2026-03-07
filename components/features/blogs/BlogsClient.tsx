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
    >
      <Link href={`/blogs/${post.slug}`} className="group block">
        {/* White card — Figma: radius 25px, padding 10px, gap 10px */}
        <div className="bg-white rounded-[25px] p-[10px] flex flex-col gap-[10px] shadow-sm group-hover:shadow-lg transition-shadow duration-300">
          {/* Image with overlay */}
          <div className="relative rounded-[18px] overflow-hidden aspect-4/3 w-full">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover grayscale brightness-60 group-hover:brightness-70 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-[15px] font-semibold leading-snug text-white mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-[13px] text-white/70 font-light">
                By {post.author}
              </p>
            </div>
          </div>

          {/* Meta row — white strip */}
          <div className="flex items-center justify-between px-2 pb-1 text-[12px] text-gray-400 italic">
            <span>{post.mins} Mins</span>
            <span className="text-gray-300">|</span>
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
      className="text-2xl md:text-3xl font-bold italic text-white mb-8"
    >
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
        <Header
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen(!menuOpen)}
        />
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
        <main className="pt-28 pb-24 pl-[90px] pr-[90px] max-w-[1431px] mx-auto">
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
            className="text-4xl md:text-5xl font-bold text-center mb-14"
          >
            Blogs
          </motion.h1>

          {/* ── Popular ─────────────────────────────────────────────────────── */}
          {sectionsConfig["blog-popular"] !== false && (
            <section className="mb-16">
              <SectionLabel label="Popular" />
              <div className="max-w-[1251px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[60px] gap-y-[60px]">
                {popularPosts.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Divider */}
          <div className="max-w-[1251px] border-t border-white/10 mb-16" />

          {/* ── Newest ──────────────────────────────────────────────────────── */}
          {sectionsConfig["blog-newest"] !== false && (
            <section>
              <SectionLabel label="Newest" delay={0.1} />
              <div className="max-w-[1251px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[60px] gap-y-[60px]">
                {newestPosts.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </section>
          )}
        </main>

        <div className="pl-[90px] pr-[90px] max-w-[1431px] mx-auto">
          <Footer />
        </div>
      </motion.div>
    </div>
  );
}
