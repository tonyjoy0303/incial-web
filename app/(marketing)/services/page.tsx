"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getServices } from "@/lib/actions/service.actions";
import { Header } from "@/components/layout";
import Footer from "@/components/layout/Footer";

// Type definition for service
interface ServiceItem {
  id: string;
  title: string;
  description: string;
  isFree: boolean;
  price: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function ServicesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const result = await getServices();
        if (result.success && result.data) {
          setServices(result.data as ServiceItem[]);
        }
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

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
        className="relative origin-top overflow-x-hidden bg-black text-white min-h-screen selection:bg-white/20"
        style={{ zIndex: 30 }}
      >
        <main className="pt-[clamp(5rem,4.4rem+2.4vw,6rem)] pb-[clamp(4rem,3.5rem+2vw,5rem)] px-[clamp(1rem,0.55rem+1.8vw,1.5rem)] md:px-[clamp(2rem,0.2rem+3vw,3rem)] lg:px-24 max-w-7xl mx-auto font-[Inter,sans-serif]">
          {/* Header Section */}
          <div className="mb-[clamp(3rem,1.8rem+4.2vw,6rem)] mt-[clamp(1.5rem,1.1rem+1.4vw,2rem)]">
            <p className="text-[#8e8e8e] text-[clamp(0.75rem,0.68rem+0.28vw,0.875rem)] uppercase tracking-[0.22em] mb-4 font-semibold">
              What We Offer
            </p>
            <h1 className="text-[clamp(2.25rem,1.7rem+2.2vw,3.75rem)] font-bold font-[Poppins,sans-serif] leading-[1.08] max-w-3xl">
              Empowering your business with tailored{" "}
              <span className="text-white/50 italic font-light">services</span>.
            </h1>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="py-[clamp(3rem,2rem+3.8vw,5rem)] text-center border border-[#1e1e1e] rounded-3xl bg-[#0a0a0a]">
              <p className="text-[#8e8e8e] text-[clamp(1rem,0.93rem+0.3vw,1.125rem)]">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="py-[clamp(3rem,2rem+3.8vw,5rem)] text-center border border-[#1e1e1e] rounded-3xl bg-[#0a0a0a]">
              <p className="text-[#8e8e8e] text-[clamp(1rem,0.93rem+0.3vw,1.125rem)]">
                New services are coming soon. Stay tuned!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(1rem,0.55rem+1.8vw,2rem)] min-h-[40vh]">
              {services.map((service: ServiceItem) => (
                <div
                  key={service.id}
                  className="group relative border border-[#1e1e1e] rounded-3xl p-[clamp(1.1rem,0.6rem+2vw,2rem)] bg-[#0a0a0a] hover:bg-[#111] transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-linear-to-br from-white via-transparent to-transparent" />

                  <div className="flex justify-between items-start mb-[clamp(1rem,0.65rem+1.3vw,1.5rem)] relative z-10 gap-[clamp(0.5rem,0.2rem+1vw,0.75rem)] max-[420px]:flex-col max-[420px]:items-start">
                    <h3 className="text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] font-bold font-[Poppins,sans-serif] leading-tight">
                      {service.title}
                    </h3>

                    {/* Free vs Paid Badge */}
                    {service.isFree ? (
                      <span className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-[clamp(0.625rem,0.59rem+0.14vw,0.6875rem)] font-semibold uppercase tracking-wider border border-green-500/20 whitespace-nowrap mt-1">
                        Free Request
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[clamp(0.625rem,0.59rem+0.14vw,0.6875rem)] font-semibold uppercase tracking-wider border border-blue-500/20 whitespace-nowrap mt-1">
                        {service.price ? `$${service.price}` : "Premium"}
                      </span>
                    )}
                  </div>

                  <p className="text-[#8e8e8e] leading-relaxed mb-[clamp(1.5rem,0.7rem+2.8vw,2.5rem)] flex-1 relative z-10 text-[clamp(0.875rem,0.82rem+0.22vw,1rem)]">
                    {service.description}
                  </p>

                  <div className="pt-[clamp(0.9rem,0.55rem+1.3vw,1.5rem)] border-t border-[#1e1e1e] relative z-10 flex items-center justify-between mt-auto max-[420px]:flex-col max-[420px]:items-start max-[420px]:gap-2">
                    <span className="text-[clamp(0.75rem,0.72rem+0.12vw,0.8125rem)] text-[#555] font-medium">
                      {new Date(service.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    {/* Example CTA button */}
                    <button className="text-[clamp(0.75rem,0.72rem+0.12vw,0.8125rem)] font-semibold text-white group-hover:underline underline-offset-4 decoration-white/30 transition-all">
                      Learn More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </motion.div>
    </div>
  );
}
