"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

// ── Job Card skeleton ──────────────────────────────────────────────────────
interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  slug: string;
}

function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/careers/${job.slug}`} className="group block">
      <div className="border border-white/10 rounded-2xl px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/30 hover:bg-white/5 transition-all duration-300">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1">
            {job.department}
          </p>
          <h3 className="text-[17px] font-semibold text-white group-hover:text-blue-400 transition-colors">
            {job.title}
          </h3>
          <p className="text-[13px] text-gray-400 mt-1">
            {job.location} · {job.type}
          </p>
        </div>
        <span className="text-sm text-blue-400 font-medium shrink-0 group-hover:underline">
          View role →
        </span>
      </div>
    </Link>
  );
}

// ── Perks ──────────────────────────────────────────────────────────────────
const perks = [
  "Flexible working hours and remote work options",
  "Learning and development programs (including our LearnTogether series)",
  "Health and wellness support",
  "Team outings, events, and celebrations",
  "Access to cutting-edge tools and technology",
  "A supportive, motivated, and collaborative team environment",
];

// ── Testimonial ────────────────────────────────────────────────────────────
interface TestimonialProps {
  delay?: number;
  text: string;
  author: string;
  role?: string;
  company?: string;
}

function TestimonialCard({
  delay = 0,
  text,
  author,
  role,
  company,
}: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex-1 min-w-0 flex flex-row justify-between gap-6"
    >
      <p className="text-[12px] text-gray-300 italic leading-relaxed max-w-[75%]">
        "{text}"
      </p>
      <div className="text-right shrink-0 flex flex-col justify-start pt-0.5">
        <p className="text-[12px] text-white font-medium">
          ~ {author}
        </p>
        <Link
          href="#"
          className="text-[11px] text-blue-400 hover:underline mt-0.5"
        >
          {role ? `${role} | ` : ""}{company || ""}
        </Link>
      </div>
    </motion.div>
  );
}

// ── LinkedIn badge (standalone link) ──────────────────────────────────────
function LinkedInBadge({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-600 hover:bg-blue-500 transition-colors shrink-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3.5 h-3.5 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05C12.6 8.9 14.3 8 16.3 8c4.1 0 4.9 2.7 4.9 6.2V24h-4v-8.8c0-2.1-.04-4.8-2.9-4.8-2.9 0-3.4 2.3-3.4 4.6V24H8V8z" />
      </svg>
    </a>
  );
}

// ── LinkedIn icon span (use INSIDE an <a> to avoid nested anchors) ─────────
function LinkedInIcon() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-600 shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3.5 h-3.5 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05C12.6 8.9 14.3 8 16.3 8c4.1 0 4.9 2.7 4.9 6.2V24h-4v-8.8c0-2.1-.04-4.8-2.9-4.8-2.9 0-3.4 2.3-3.4 4.6V24H8V8z" />
      </svg>
    </span>
  );
}

// ── Fade helper ────────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function CareersPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const jobs: Job[] = [];
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/admin/sections");
        const data = await res.json();
        const careersConfig = data.sections?.find(
          (s: any) => s.id === "careers",
        );
        if (careersConfig && !careersConfig.enabled) {
          setIsDisabled(true);
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
        className="relative origin-top overflow-x-hidden bg-black text-white min-h-screen"
        style={{ zIndex: 30 }}
      >
        <main className="pt-24 pb-32">
          {/* ── Breadcrumb ───────────────────────────────────────────────── */}
          <div className="flex justify-center mb-10 pt-4">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Careers" }]}
              variant="pill"
              size="lg"
            />
          </div>

          {/* ── Page title ───────────────────────────────────────────────── */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center text-3xl md:text-[32px] font-bold mb-14 px-6"
          >
            Careers at <span className="text-blue-400">Incial</span>
          </motion.h1>

          {/* ── Main content container ────────────────────────────────────── */}
          <div className="mx-auto w-full max-w-[1100px] px-10 md:px-20">
            {/* Hero two-col */}
            <section className="mb-16">
              <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-16">
                <FadeIn delay={0.1} className="md:w-[38%] shrink-0">
                  <p className="text-[20px] md:text-[22px] font-bold leading-snug">
                    We're not just building brands: we're building a team that
                    loves Mondays.{" "}
                    <span className="italic text-blue-400">
                      (most of the time)
                    </span>
                  </p>
                </FadeIn>
                <FadeIn delay={0.2} className="md:w-[55%]">
                  <p className="text-[12px] md:text-[13px] text-gray-300 leading-relaxed text-right">
                    Incial began with a simple vision: to empower brands,
                    businesses, and ideas with innovative digital solutions that
                    create lasting impact. Founded in 2024 in Kanjirappally,
                    Kerala, we started as a small team of passionate creators
                    and strategists determined to make a difference. From those
                    first projects to now serving businesses across industries,
                    our journey has been fueled by creativity, collaboration,
                    and a relentless drive to push boundaries.
                  </p>
                </FadeIn>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-white/10 mb-16" />

            {/* Current Openings */}
            <section className="mb-6">
              <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-16">
                <FadeIn delay={0.1} className="md:w-[38%] shrink-0">
                  <h2 className="text-2xl md:text-[26px] font-bold">
                    Current Openings
                  </h2>
                </FadeIn>
                <FadeIn delay={0.2} className="md:w-[55%]">
                  {jobs.length === 0 ? (
                    <p className="text-[12px] md:text-[13px] text-gray-300 leading-relaxed">
                      We're growing fast, but at the moment, there are no open
                      positions. However, we're always eager to connect with
                      passionate individuals who share our values and
                      creativity.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  )}
                </FadeIn>
              </div>
            </section>

            {/* CTA row */}
            <FadeIn delay={0.3} className="mb-24">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-[12px] text-gray-400 italic">
                  If that sounds like you, send us your portfolio or resume —
                  we'd love to stay in touch.
                </p>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="mailto:careers@incial.in"
                    className="text-[12px] text-blue-400 hover:underline"
                  >
                    careers@incial.in
                  </a>
                  <span className="text-gray-600 text-xs">|</span>
                  <LinkedInBadge href="https://linkedin.com/company/incial" />
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ── Life at Incial white card ─────────────────────────────────── */}
          <section className="px-6 md:px-10 max-w-[1320px] mx-auto mb-16">
            <FadeIn>
              <div
                className="bg-white rounded-[25px] text-center flex flex-col items-center w-full"
                style={{
                  paddingTop: "40px",
                  paddingBottom: "40px",
                  paddingLeft: "82px",
                  paddingRight: "82px",
                  gap: "16px",
                }}
              >
                <h2
                  className="text-black whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-poppins)",
                    fontWeight: 700,
                    fontSize: "36px",
                    lineHeight: "100%",
                    letterSpacing: 0,
                    textAlign: "center",
                  }}
                >
                  Life at Incial
                </h2>
                <p
                  className="text-gray-500 whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-poppins)",
                    fontWeight: 400,
                    fontStyle: "italic",
                    fontSize: "16px",
                    lineHeight: "100%",
                    letterSpacing: 0,
                    textAlign: "center",
                  }}
                >
                  Work at Incial goes beyond deliverables — it's about
                  collaboration, innovation, and growth.
                </p>
              </div>
            </FadeIn>
          </section>

          {/* ── Culture quote ─────────────────────────────────────────────── */}
          <FadeIn
            delay={0.1}
            className="px-10 md:px-20 max-w-[1100px] mx-auto mb-20 text-center"
          >
            <p className="text-[13px] text-gray-400 italic max-w-sm mx-auto leading-relaxed">
              Our culture values respect, curiosity, and continuous learning. We
              create space for fresh ideas and ensure that every voice
              contributes to shaping our journey.
            </p>
          </FadeIn>

          {/* ── Perks list — right aligned ────────────────────────────────── */}
          <section className="px-10 md:px-20 max-w-[1100px] mx-auto mb-24">
            <div className="flex flex-col md:flex-row items-start gap-10">
              {/* decorative career image shown on larger screens */}
              <div className="hidden md:block flex-shrink-0 order-last md:order-first">
                <Image
                  src="/Career.png"
                  alt="Join us at Incial"
                  width={400}
                  height={400}
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col gap-5 max-w-[580px] ml-auto">
                {perks.map((perk, i) => (
                  <FadeIn key={i} delay={i * 0.06}>
                    <p className="text-[13px] text-gray-200">{perk}</p>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* ── Testimonials ──────────────────────────────────────────────── */}
          <section className="px-10 md:px-20 max-w-[1100px] mx-auto mb-28">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16">
              <TestimonialCard
                delay={0.1}
                text="Our culture values respect, curiosity, and continuous learning. We create space for fresh ideas and ensure that every voice contributes to shaping our journey."
                author="Abidh Habeeb"
                role="CEO"
                company="Incial"
              />
              <TestimonialCard
                delay={0.2}
                text="Great marketing isn’t just about visibility, it’s about building genuine connections. At Incial, we focus on telling stories that resonate, inspire trust and create lasting relationships with the people we serve."
                author="Alan Joseph"
                role="CMO"
                company="Incial"
              />
            </div>
          </section>

          {/* ── Looking Ahead ─────────────────────────────────────────────── */}
          <section className="px-10 md:px-20 max-w-[1100px] mx-auto">
            <FadeIn className="text-center mb-5">
              <h2 className="text-3xl md:text-4xl font-bold">Looking Ahead</h2>
            </FadeIn>
            <FadeIn delay={0.15} className="text-center mb-10">
              <p className="text-[13px] text-gray-400 max-w-[280px] mx-auto leading-relaxed">
                If you'd like to be part of Incial's future opportunities, send
                us your resume at:
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px]">
                <a
                  href="mailto:careers@incial.in"
                  className="text-blue-400 hover:underline"
                >
                  careers@incial.in
                </a>
                <span className="text-gray-600">|</span>
                <a
                  href="https://linkedin.com/company/incial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
                >
                  connect with us on LinkedIn
                  <LinkedInIcon />
                </a>
              </div>
            </FadeIn>
          </section>
        </main>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <div className="px-10 md:px-20 max-w-[1100px] mx-auto">
          <Footer />
        </div>
      </motion.div>
    </div>
  );
}
