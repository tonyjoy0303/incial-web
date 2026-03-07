"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/layout/Footer";

import Image from "next/image";

// ── Local Asset URLs ──────────
const imgHeroBanner = "/images/about/Team-Photo.png";
const imgBrand = "/images/about/imgBrand.png";
const imgImpact = "/images/about/imgImpact.png";

// ── Fade-up animation variant ─────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay,
    },
  }),
};

import { AboutData } from "@/lib/dataLoader";

interface AboutSectionProps {
  onBack?: () => void;
  onComplete?: () => void;
}

export default function AboutSection({
  onBack,
  onComplete,
}: AboutSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<AboutData | null>(null);
  const [brandSrc, setBrandSrc] = useState(imgBrand);
  const [impactSrc, setImpactSrc] = useState(imgImpact);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    fetch("/api/admin/about")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        // initialize image sources; fallback if undefined
        setBrandSrc(d?.brandImage || imgBrand);
        setImpactSrc(d?.impactImage || imgImpact);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || (!onBack && !onComplete)) return;

    const handleScroll = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop === 0;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 5;
      if (e.deltaY < 0 && isAtTop && onBack) {
        e.preventDefault();
        onBack();
      }
      if (e.deltaY > 0 && isAtBottom && onComplete) {
        e.preventDefault();
        onComplete();
      }
    };

    container.addEventListener("wheel", handleScroll, { passive: false });
    return () => container.removeEventListener("wheel", handleScroll);
  }, [onBack, onComplete]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
  };

  return (
    <section
      ref={containerRef}
      className="w-full bg-black text-white overflow-y-auto overflow-x-hidden relative scrollbar-hide"
      style={{ minHeight: "100vh" }}
    >
      {/* ── Breadcrumb ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 pt-6 pb-2">
        <span className="bg-[#05101e] text-[#49a8ff] text-[10px] font-[Poppins,sans-serif] px-3 py-1 rounded-full">
          Home
        </span>
        <span className="text-[#49a8ff] text-[10px] rotate-90 inline-block">
          ›
        </span>
        <span className="bg-[#05101e] text-[#49a8ff] text-[10px] font-[Poppins,sans-serif] px-3 py-1 rounded-full">
          About Us
        </span>
      </div>

      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="mx-auto mt-4 mb-0 rounded-3xl overflow-hidden relative"
        style={{ width: "calc(100% - 96px)", maxWidth: 1252, height: 675 }}
      >
        {data?.heroBanner ? (
          <Image
            src={data.heroBanner}
            alt="Incial team"
            fill
            priority
            sizes="(max-width: 1252px) 100vw, 1252px"
            className="object-cover object-top"
          />
        ) : (
          <Image
            src={imgHeroBanner}
            alt="Incial team"
            fill
            priority
            sizes="(max-width: 1252px) 100vw, 1252px"
            className="object-cover object-top"
          />
        )}
      </motion.div>

      {/* ── Our Story ────────────────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0.1}
        className="text-center px-6 pt-16 pb-12 max-w-4xl mx-auto"
      >
        <h2 className="font-[Poppins,sans-serif] font-bold text-[36px] text-white mb-6">
          {data?.storyTitle || "Our Story"}
        </h2>
        <p className="font-[Poppins,sans-serif] italic text-[16px] text-white/80 leading-relaxed max-w-3xl mx-auto">
          {data?.storyText ||
            "Incial began with a simple vision: to empower brands, businesses, and ideas with innovative digital solutions that create lasting impact. Founded in 2024 in Kanjirappally, Kerala, we started as a small team of passionate creators and strategists determined to make a difference. From those first projects to now serving businesses across industries, our journey has been fueled by creativity, collaboration, and a relentless drive to push boundaries."}
        </p>
      </motion.div>

      {/* ── Our Purpose (white card) ──────────────────────────────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0.15}
        className="mx-auto bg-white text-black rounded-3xl px-20 py-16 mb-16 flex flex-col gap-8"
        style={{ width: "calc(100% - 96px)", maxWidth: 1253 }}
      >
        <h2 className="font-[Poppins,sans-serif] font-bold text-[36px]">
          {data?.purposeTitle || "Our Purpose"}
        </h2>
        <p className="font-[Poppins,sans-serif] italic text-[16px] leading-relaxed max-w-3xl">
          {data?.purposeText ||
            "Our purpose is clear: to build brands that resonate, businesses that grow, and beyond that, to innovate continuously. We align strategy with creativity, technology with human connection, and ideas with measurable results."}
        </p>
      </motion.div>

      {/* ── Meet Our Team ────────────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0.1}
        className="text-center px-6 pt-4 pb-6"
      >
        <h2 className="font-[Poppins,sans-serif] font-bold text-[36px] text-white mb-5">
          {data?.teamTitle || "Meet Our Team"}
        </h2>
        <p className="font-[Poppins,sans-serif] italic text-[16px] text-white/80 max-w-3xl mx-auto mb-12">
          {data?.teamSubtitle ||
            "Behind every project is a team of talented professionals — creatives, marketers, designers, and technologists — united by passion and expertise. Together, we bring ideas to life and transform challenges into opportunities."}
        </p>
      </motion.div>

      <div
        className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-24 px-6"
        style={{ maxWidth: 900 }}
      >
        {(data?.teamMembers || []).map((member, i) => (
          <TeamMemberCard
            key={member.id || i}
            member={member}
            delay={i * 0.1}
          />
        ))}
      </div>


      {/* ── Our Brand + Our Impact (stacked image cards) ─────────────── */}
      <div
        className="mx-auto mb-16"
        style={{ width: "calc(100% - 96px)", maxWidth: 1256 }}
      >
        {/* Brand */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="relative h-[245px] rounded-tl-3xl rounded-tr-3xl overflow-hidden"
        >
          <Image
            src={brandSrc}
            alt="Our Brand"
            fill
            sizes="(max-width: 1256px) 100vw, 1256px"
            className="object-cover object-center"
            onError={() => {
              if (brandSrc !== imgBrand) setBrandSrc(imgBrand);
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col justify-center px-14 gap-3">
            <h3 className="font-[Poppins,sans-serif] font-bold text-[36px] text-white">
              {data?.brandTitle || "Our Brand"}
            </h3>
            <p className="font-[Poppins,sans-serif] italic text-[16px] text-white/90 max-w-3xl leading-relaxed">
              {data?.brandText ||
                "At Incial, our brand echoes our values: authentic, innovative, and trusted. We believe in transparency, empathy, and delivering beyond expectations. Every interaction is a chance to build lasting relationships."}
            </p>
          </div>
        </motion.div>

        {/* Impact */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0.1}
          className="relative h-[245px] rounded-bl-3xl rounded-br-3xl overflow-hidden"
        >
          <Image
            src={impactSrc}
            alt="Our Impact"
            fill
            sizes="(max-width: 1256px) 100vw, 1256px"
            className="object-cover object-center"
            onError={() => {
              if (impactSrc !== imgImpact) setImpactSrc(imgImpact);
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col justify-center px-14 gap-3">
            <h3 className="font-[Poppins,sans-serif] font-bold text-[36px] text-white">
              {data?.impactTitle || "Our Impact"}
            </h3>
            <p className="font-[Poppins,sans-serif] italic text-[16px] text-white/90 max-w-3xl leading-relaxed">
              {data?.impactText ||
                "Every project is a story of growth, transformation, and measurable success. We take pride in helping clients achieve goals, enhance visibility, and create memorable digital experiences."}
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="flex flex-col items-center text-center px-6 pt-8 pb-12"
      >
        <h2 className="font-[Poppins,sans-serif] font-bold italic text-[32px] text-white mb-3">
          Have a question? Need a quote?
        </h2>
        <p className="font-[Poppins,sans-serif] text-[16px] text-white/70 mb-10">
          We promise to reply within 24 hours, every time.
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[606px] flex flex-col gap-4"
        >
          {/* Name */}
          <div className="border border-[#1e1e1e] rounded-full h-[42px] flex items-center px-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-[#8e8e8e] text-[16px] font-[Inter,sans-serif]"
            />
          </div>
          {/* Email */}
          <div className="border border-[#1e1e1e] rounded-full h-[42px] flex items-center px-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-[#8e8e8e] text-[16px] font-[Inter,sans-serif]"
            />
          </div>
          {/* Phone */}
          <div className="border border-[#1e1e1e] rounded-full h-[42px] flex items-center px-6">
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-[#8e8e8e] text-[16px] font-[Inter,sans-serif]"
            />
          </div>
          {/* Message */}
          <div className="border border-[#1e1e1e] rounded-3xl min-h-[140px] px-6 py-4 relative">
            <textarea
              name="message"
              placeholder="Message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-[#8e8e8e] resize-none mb-10 text-[16px] font-[Inter,sans-serif]"
            />
            <button
              type="submit"
              className="absolute bottom-4 right-4 bg-white text-black font-semibold text-[13px] font-[Inter,sans-serif] px-4 py-2 rounded-xl shadow-[0_0_50px_0_rgba(0,133,255,0.2)] hover:bg-gray-100 transition-colors"
            >
              Contact
            </button>
          </div>
        </form>
      </motion.div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div className="px-12 pb-6">
        <Footer />
      </div>
    </section>
  );
}

// ── Team member card sub-component ───────────────────────────────────────
function TeamMemberCard({
  member,
  delay,
}: {
  member: any;
  delay: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={delay}
      className="flex flex-col items-center text-center"
    >
      {/* Blue glow circle BG + avatar */}
      <div className="relative w-[247px] h-[276px] mb-4 overflow-hidden rounded-[125px]">
        <div className="absolute bottom-0 left-0 w-[247px] h-[247px] rounded-full bg-[#d5d5d5]" />
        <Image
          src={member.img || "/images/about/team-placeholder.jpg"}
          alt={member.name}
          fill
          sizes="247px"
          className={`object-cover ${member.objectPos || "object-top"} grayscale hover:grayscale-0 transition-all duration-500`}
        />
      </div>
      <h3 className="font-[Poppins,sans-serif] font-bold text-[24px] text-white">
        {member.name}
      </h3>
      <p className="font-[Poppins,sans-serif] italic text-[16px] text-white/70">
        {member.role}
      </p>
    </motion.div>
  );
}
