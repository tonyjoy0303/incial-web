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
        <main className="pt-24 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto font-[Inter,sans-serif]">
          {/* Header Section */}
          <div className="mb-16 md:mb-24 mt-8">
            <p className="text-[#8e8e8e] text-sm uppercase tracking-widest mb-4 font-semibold">
              What We Offer
            </p>
            <h1 className="text-4xl md:text-6xl font-bold font-[Poppins,sans-serif] leading-tight max-w-3xl">
              Empowering your business with tailored{" "}
              <span className="text-white/50 italic font-light">services</span>.
            </h1>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="py-20 text-center border border-[#1e1e1e] rounded-3xl bg-[#0a0a0a]">
              <p className="text-[#8e8e8e] text-lg">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="py-20 text-center border border-[#1e1e1e] rounded-3xl bg-[#0a0a0a]">
              <p className="text-[#8e8e8e] text-lg">
                New services are coming soon. Stay tuned!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[40vh]">
              {services.map((service: ServiceItem) => (
                <div
                  key={service.id}
                  className="group relative border border-[#1e1e1e] rounded-3xl p-8 bg-[#0a0a0a] hover:bg-[#111] transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-linear-to-br from-white via-transparent to-transparent" />

                  <div className="flex justify-between items-start mb-6 relative z-10 gap-2">
                    <h3 className="text-xl md:text-2xl font-bold font-[Poppins,sans-serif]">
                      {service.title}
                    </h3>

                    {/* Free vs Paid Badge */}
                    {service.isFree ? (
                      <span className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-semibold uppercase tracking-wider border border-green-500/20 whitespace-nowrap mt-1">
                        Free Request
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold uppercase tracking-wider border border-blue-500/20 whitespace-nowrap mt-1">
                        {service.price ? `$${service.price}` : "Premium"}
                      </span>
                    )}
                  </div>

                  <p className="text-[#8e8e8e] leading-relaxed mb-10 flex-1 relative z-10 text-sm">
                    {service.description}
                  </p>

                  <div className="pt-6 border-t border-[#1e1e1e] relative z-10 flex items-center justify-between mt-auto">
                    <span className="text-xs text-[#555] font-medium">
                      {new Date(service.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    {/* Example CTA button */}
                    <button className="text-xs font-semibold text-white group-hover:underline underline-offset-4 decoration-white/30 transition-all">
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
