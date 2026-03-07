"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import type { ProductsData, Product } from "@/lib/dataLoader";

// ── Arrow icon ─────────────────────────────────────────────────────────────
function ArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  );
}

// ── Product Section ────────────────────────────────────────────────────────
function ProductSection({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
    >
      {/* Product name */}
      <h2 className="text-2xl md:text-[28px] font-bold text-white mb-6">
        {product.name}
      </h2>

      {/* Image card */}
      <div
        className="relative w-full mb-8 overflow-hidden bg-[#111]"
        style={{ height: "408px", borderRadius: "10px" }}
      >
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-top"
            priority={index === 0}
          />
        )}
      </div>

      {/* Description + CTA row */}
      <div className="flex flex-col" style={{ gap: "20px" }}>
        {(Array.isArray(product.description)
          ? product.description
          : (product.description || "").split("\n\n").filter(Boolean)
        ).map((para, i, arr) => (
          <div key={i} className="flex items-end justify-between gap-8">
            <p
              className="text-white"
              style={{
                fontFamily: "var(--font-poppins)",
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: "16px",
                lineHeight: "1.6",
                letterSpacing: 0,
              }}
            >
              {para}
            </p>
            {/* CTA only shown beside the last paragraph */}
            {i === arr.length - 1 && product.tryUrl && (
              <a
                href={product.tryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 bg-white text-black rounded-full px-5 py-2.5 text-[13px] font-medium hover:bg-gray-100 transition-all duration-300 whitespace-nowrap"
              >
                Try it Out <ArrowRight />
              </a>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [sectionsConfig, setSectionsConfig] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/admin/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: ProductsData = await res.json();
        // optionally filter for available and featured products
        setProducts(data.products.filter((p) => p.available));
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
        const prodConfig = data.sections?.find((s: any) => s.id === "products");
        if (prodConfig && !prodConfig.enabled) {
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
      fetchProducts();
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
        <main className="pt-24 pb-20">
          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 px-6"
          >
            <div className="flex justify-center mb-10">
              <Breadcrumbs
                items={[{ label: "Home", href: "/" }, { label: "Products" }]}
                variant="pill"
                size="lg"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold italic mb-3">
              Products
            </h1>
            <p className="text-[14px] text-gray-400 italic">
              Built to work. Built to scale. Built for real businesses.
            </p>
          </motion.div>

          {/*
            ── Products container
            Figma: left 149px, width 1141px → max-w-[1141px] with px matching left offset
            gap: 150px between products
          */}
          <div
            className="mx-auto w-full px-6 md:px-[149px]"
            style={{ maxWidth: "1439px" }}
          >
            {sectionsConfig["products-list"] !== false &&
              (loading ? (
                <div className="text-center text-white/50 text-sm py-20 italic">
                  Loading products...
                </div>
              ) : (
                <div className="flex flex-col" style={{ gap: "150px" }}>
                  {products.length === 0 ? (
                    <div className="text-center text-white/50 text-sm italic py-10">
                      No products available at the moment.
                    </div>
                  ) : (
                    products.map((product, i) => (
                      <ProductSection
                        key={product.id}
                        product={product}
                        index={i}
                      />
                    ))
                  )}
                </div>
              ))}

            {/* ── Coming soon ────────────────────────────────────────────── */}
            {sectionsConfig["products-coming-soon"] !== false && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center pt-[100px] pb-16 flex flex-col items-center"
                style={{ gap: "54px" }}
              >
                <h3
                  className="text-white"
                  style={{
                    fontFamily: "var(--font-poppins)",
                    fontWeight: 600,
                    fontStyle: "normal",
                    fontSize: "20px",
                    lineHeight: "100%",
                    letterSpacing: 0,
                    textAlign: "center",
                  }}
                >
                  Built by Incial. Designed for real businesses. More coming
                  soon.
                </h3>
                <p
                  className="text-white max-w-[1141px]"
                  style={{
                    fontFamily: "var(--font-poppins)",
                    fontWeight: 400,
                    fontStyle: "italic",
                    fontSize: "16px",
                    lineHeight: "1.6",
                    letterSpacing: 0,
                    textAlign: "center",
                  }}
                >
                  WorkHub and StockFlow are just the beginning. We are actively
                  building more solutions focused on automation, operations,
                  analytics, and business growth. All upcoming products follow
                  the same philosophy — simple, practical, and customisable for
                  real business needs.
                </p>
              </motion.div>
            )}
          </div>
        </main>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div
          className="mx-auto w-full px-6 md:px-[149px]"
          style={{ maxWidth: "1439px" }}
        >
          <Footer />
        </div>
      </motion.div>
    </div>
  );
}
