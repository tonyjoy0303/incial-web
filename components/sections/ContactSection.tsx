"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/layout/Footer";

interface ContactSectionProps {
  onBack?: () => void;
}

export default function ContactSection({ onBack }: ContactSectionProps) {
  useEffect(() => {
    const isCoarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    const scrollThreshold = isCoarsePointer ? 24 : 40;
    const scrollLockMs = isCoarsePointer ? 700 : 1200;
    let isScrolling = false;

    const lockScroll = () => {
      isScrolling = true;
      setTimeout(() => {
        isScrolling = false;
      }, scrollLockMs);
    };

    const handleScroll = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < scrollThreshold) return;
      if (isScrolling) return;
      // If scrolling UP and at the top of the page
      if (e.deltaY < 0 && window.scrollY === 0 && onBack) {
        e.preventDefault();
        lockScroll();
        onBack();
      }
    };

    // Touch support (Swipe Down at top)
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling) return;
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      // Swipe Down (negative deltaY) and at top
      if (deltaY < -scrollThreshold && window.scrollY === 0 && onBack) {
        e.preventDefault();
        lockScroll();
        onBack();
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [onBack]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage(
        "Please fill in required fields: Name, Email, and Message.",
      );
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });

      // Reset status after a few seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error: any) {
      console.error("Form submission error:", error);
      setErrorMessage(error.message || "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="min-h-screen w-full bg-black text-white flex flex-col justify-between pt-24 pb-8 relative overflow-hidden">
      <div className="layout-content grow flex flex-col justify-center items-center max-w-2xl w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: "1.25rem" }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Have a question? Need a quote?
          </h2>
          <p className="text-lg text-gray-400">
            We promise to reply within 24 hours, every time.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: "1.875rem" }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="w-full space-y-6"
        >
          {/* Name Field */}
          <div className="bg-white/5 border border-white/10 rounded-full px-6 py-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-gray-500"
            />
          </div>

          {/* Email Field */}
          <div className="bg-white/5 border border-white/10 rounded-full px-6 py-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-gray-500"
            />
          </div>

          {/* Phone Field */}
          <div className="bg-white/5 border border-white/10 rounded-full px-6 py-3">
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-gray-500"
            />
          </div>

          {/* Message Field */}
          <div className="bg-white/5 border border-white/10 rounded-3xl px-6 py-4 relative">
            <textarea
              name="message"
              placeholder="Message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-gray-500 resize-none mb-12"
            />

            {status === "success" && (
              <p className="absolute bottom-4 left-6 text-green-400 text-sm">
                Message sent successfully!
              </p>
            )}
            {status === "error" && (
              <p
                className="absolute bottom-4 left-6 text-red-500 text-sm max-w-[70%] line-clamp-2"
                title={errorMessage}
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="absolute bottom-4 right-4 bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Sending..." : "Contact"}
            </button>
          </div>
        </motion.form>
      </div>

      <Footer />
    </section>
  );
}
