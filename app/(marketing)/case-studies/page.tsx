"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import type { CaseStudiesData, CaseStudy } from "@/lib/dataLoader";

export default function CaseStudiesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [sectionsConfig, setSectionsConfig] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    async function fetchCases() {
      try {
        const res = await fetch("/api/admin/casestudies");
        if (!res.ok) throw new Error("Failed to fetch case studies");
        const data: CaseStudiesData = await res.json();
        // optionally filter. If there's an 'available' or 'published' flag, filter by it. Assuming all returned cases are public.
        setCaseStudies(data.cases.filter((c) => c.slug));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchConfig() {
      try {
        const res = await fetch("/api/admin/sections");
        const data = await res.json();
        const csConfig = data.sections?.find(
          (s: any) => s.id === "casestudies",
        );
        if (csConfig && !csConfig.enabled) {
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

    fetchConfig().then(() => {
      fetchCases();
    });
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

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Header */}
      <Header menuOpen={menuOpen} onToggleMenu={handleToggleMenu} />

      <motion.div
        animate={{
          y: menuOpen ? 100 : 0,
          scale: menuOpen ? 0.95 : 1,
          borderTopLeftRadius: menuOpen ? 24 : 0,
          borderTopRightRadius: menuOpen ? 24 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative origin-top overflow-x-hidden bg-black text-white min-h-screen"
        style={{ zIndex: 30 }}
      >
        {/* Main Content */}
        <main className="pt-32 pb-20">
          {/* Breadcrumb */}
          <div className="mb-10 px-6 md:px-16 lg:px-24 xl:px-32 max-w-[1400px] mx-auto">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Work" }]}
              variant="pill"
              size="lg"
            />
          </div>

          {/* Hero Section with Image - Full Width */}
          {sectionsConfig["casestudies-hero"] !== false && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-16 relative px-4 md:px-8 lg:px-12"
            >
              {/* Hero Image with overlay text */}
              <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden mb-12 max-w-[1600px] mx-auto">
                <Image
                  src="https://ik.imagekit.io/0bs3my2iz/incial-web/images/case1.webp"
                  alt="Case Study Hero"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                    Case Study
                  </h1>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm md:text-base max-w-3xl mx-auto text-center leading-relaxed italic">
                At Incial, we pride ourselves on developing tailored digital
                solutions that make a real impact. Here's a glimpse of some of
                the projects we've brought to life across various industries:
              </p>
            </motion.section>
          )}

          {/* Case Studies List */}
          {sectionsConfig["casestudies-list"] !== false && (
            <div className="space-y-16 mt-20 px-6 md:px-16 lg:px-24 xl:px-32 max-w-[1400px] mx-auto">
              {loading ? (
                <div className="text-center text-white/50 text-sm py-20 italic">
                  Loading case studies...
                </div>
              ) : caseStudies.length === 0 ? (
                <div className="text-center text-white/50 text-sm py-10 italic">
                  No case studies available.
                </div>
              ) : (
                caseStudies.map((study, index) => (
                  <motion.article
                    key={study.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="group relative border-b border-white/10 pb-16 last:border-b-0"
                  >
                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="block"
                    >
                      <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
                        {/* Image */}
                        <div className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0 overflow-hidden rounded-xl">
                          <div className="relative aspect-[420/240] w-full">
                            {study.heroImage ? (
                              <Image
                                src={study.heroImage}
                                alt={study.title}
                                fill
                                className="object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#222]" />
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-2">
                          <div className="text-[11px] text-gray-500 uppercase tracking-widest mb-3 font-light">
                            {study.category || "General"}
                          </div>
                          <h2 className="text-xl md:text-2xl lg:text-[28px] font-semibold mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                            {study.title}
                          </h2>
                          <p className="text-gray-400 leading-relaxed text-[15px] md:text-base line-clamp-3">
                            "{study.heroQuote}"
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 max-w-[1400px] mx-auto mt-20">
          <Footer />
        </div>
      </motion.div>
    </div>
  );
}
