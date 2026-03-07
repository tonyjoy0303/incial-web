"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  Star,
  StarOff,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { apiGetSection, apiSaveSection } from "@/lib/adminApi";
import type { ProductsData, Product } from "@/lib/dataLoader";
import { toast } from "sonner";
import SectionVisibilityToggle from "@/components/admin/SectionVisibilityToggle";
import ImageUpload from "@/components/admin/ImageUpload";
const inputCls =
  "w-full bg-transparent border border-[#1e1e1e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-white/50 transition-all font-[Inter,sans-serif]";
const labelCls =
  "text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-wider font-[Inter,sans-serif]";

function newProduct(): Product {
  return {
    id: String(Date.now()),
    name: "",
    tagline: "by Incial",
    image: "",
    description: [""],
    tryUrl: "",
    featured: false,
    available: true,
  };
}

export default function AdminProductsPage() {
  const [data, setData] = useState<ProductsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    apiGetSection<ProductsData>("products")
      .then((res) => {
        if (res && res.products) {
          const normalizedProducts = res.products.map((p) => ({
            ...p,
            description: Array.isArray(p.description)
              ? p.description
              : (p.description || "").split("\n\n").filter(Boolean),
          }));
          setData({ ...res, products: normalizedProducts });
        } else {
          setData(res);
        }
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      await apiSaveSection("products", data);
      toast.success("Products saved!");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  function updateProduct(field: keyof Product, value: any) {
    if (!data) return;
    const products = [...data.products];
    products[selected] = { ...products[selected], [field]: value };
    setData({ ...data, products });
  }

  function updateDescription(
    productIdx: number,
    paraIdx: number,
    value: string,
  ) {
    if (!data) return;
    const products = [...data.products];
    const oldDesc = products[productIdx].description;
    const description = Array.isArray(oldDesc)
      ? [...oldDesc]
      : (oldDesc || "").split("\n\n").filter(Boolean);
    description[paraIdx] = value;
    products[productIdx] = { ...products[productIdx], description };
    setData({ ...data, products });
  }

  function addDescriptionPara(productIdx: number) {
    if (!data) return;
    const products = [...data.products];
    const oldDesc = products[productIdx].description;
    const description = Array.isArray(oldDesc)
      ? [...oldDesc]
      : (oldDesc || "").split("\n\n").filter(Boolean);
    description.push("");
    products[productIdx] = { ...products[productIdx], description };
    setData({ ...data, products });
  }

  function removeDescriptionPara(productIdx: number, paraIdx: number) {
    if (!data) return;
    const products = [...data.products];
    const oldDesc = products[productIdx].description;
    const descArray = Array.isArray(oldDesc)
      ? oldDesc
      : (oldDesc || "").split("\n\n").filter(Boolean);
    const description = descArray.filter((_, i) => i !== paraIdx);
    products[productIdx] = { ...products[productIdx], description };
    setData({ ...data, products });
  }

  function addProduct() {
    if (!data) return;
    const next = [...data.products, newProduct()];
    setData({ ...data, products: next });
    setSelected(next.length - 1);
  }

  function removeProduct(idx: number) {
    if (!data) return;
    const next = data.products.filter((_, i) => i !== idx);
    setData({ ...data, products: next });
    setSelected(Math.min(selected, Math.max(0, next.length - 1)));
  }

  if (!data)
    return (
      <div className="flex items-center justify-center h-40 text-white/40">
        <Loader2 size={20} className="animate-spin mr-2" /> Loading…
      </div>
    );

  const active = data.products[selected];

  return (
    <div className="flex flex-col h-full gap-0 font-[Inter,sans-serif]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white font-[Poppins,sans-serif]">
            Products
          </h2>
          <p className="text-[#8e8e8e] text-sm mt-1">
            {data.products.length} product
            {data.products.length === 1 ? "" : "s"} ·{" "}
            {data.products.filter((c) => c.featured).length} featured
          </p>
        </div>
        <div className="flex items-center gap-6">
          <SectionVisibilityToggle sectionId="products" />
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-white hover:bg-gray-200 disabled:opacity-50 text-black text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* ── Split layout ── */}
      <div className="flex gap-6 flex-1 min-h-0">
        {/* LEFT: Product list + editor */}
        <div className="w-[440px] shrink-0 flex flex-col gap-4 overflow-hidden">
          {/* List */}
          <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1 shrink-0">
            {data.products.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setSelected(i)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all group ${
                  selected === i
                    ? "bg-white text-black"
                    : "border border-[#1e1e1e] text-[#8e8e8e] hover:text-white hover:bg-[#0a0a0a]"
                }`}
              >
                {p.featured ? (
                  <Star
                    size={12}
                    className={`shrink-0 ${selected === i ? "fill-black text-black" : "fill-white text-white"}`}
                  />
                ) : (
                  <div className="w-3 h-3 shrink-0" />
                )}
                <span className="flex-1 text-sm font-medium truncate font-[Poppins,sans-serif]">
                  {p.name || `Product ${i + 1}`}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider ${selected === i ? "text-black/50" : "text-[#555]"}`}
                >
                  Enterprise
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProduct(i);
                  }}
                  className={`shrink-0 ${selected === i ? "text-red-500" : "text-red-500/0 group-hover:text-red-500/70"}`}
                >
                  <Trash2 size={12} />
                </button>
              </button>
            ))}
            <button
              onClick={addProduct}
              className="flex items-center gap-2 px-4 py-2 text-xs text-white hover:text-gray-300 font-medium transition-colors"
            >
              <Plus size={13} /> Add Product
            </button>
          </div>

          {/* Editor form for selected product */}
          {active && (
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 border border-[#1e1e1e] rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className={labelCls}>
                  Editing: Product {selected + 1}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateProduct("available", !active.available)
                    }
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                      active.available
                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                        : "border border-[#1e1e1e] text-[#8e8e8e] hover:text-white"
                    }`}
                  >
                    {active.available ? (
                      <CheckCircle2 size={11} />
                    ) : (
                      <Circle size={11} />
                    )}
                    Available
                  </button>
                  <button
                    onClick={() => updateProduct("featured", !active.featured)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                      active.featured
                        ? "bg-white text-black"
                        : "border border-[#1e1e1e] text-[#8e8e8e] hover:text-white"
                    }`}
                  >
                    {active.featured ? (
                      <Star size={11} className="fill-black text-black" />
                    ) : (
                      <StarOff size={11} />
                    )}
                    Featured
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className={labelCls}>Name</label>
                  <input
                    type="text"
                    value={active.name}
                    onChange={(e) => updateProduct("name", e.target.value)}
                    placeholder="Product Name"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Tagline</label>
                  <input
                    type="text"
                    value={active.tagline}
                    onChange={(e) => updateProduct("tagline", e.target.value)}
                    placeholder="by Incial"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <ImageUpload
                  label="Image"
                  value={active.image}
                  onChange={(v) => updateProduct("image", v)}
                  folder="images/products"
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelCls}>Try URL</label>
                <input
                  type="text"
                  value={active.tryUrl}
                  onChange={(e) => updateProduct("tryUrl", e.target.value)}
                  placeholder="https://..."
                  className={inputCls}
                />
              </div>

              <div className="space-y-2">
                <label className={labelCls}>Description Paragraphs</label>
                {(Array.isArray(active.description)
                  ? active.description
                  : (active.description || "").split("\n\n").filter(Boolean)
                ).map((para, ti) => (
                  <div key={ti} className="flex gap-2">
                    <textarea
                      rows={3}
                      value={para}
                      onChange={(e) =>
                        updateDescription(selected, ti, e.target.value)
                      }
                      placeholder="Paragraph text..."
                      className={`${inputCls} resize-none flex-1`}
                    />
                    <button
                      onClick={() => removeDescriptionPara(selected, ti)}
                      className="text-red-500/70 hover:text-red-500 shrink-0 self-start mt-2"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addDescriptionPara(selected)}
                  className="flex items-center gap-2 text-white hover:text-gray-300 text-xs font-medium transition-colors"
                >
                  <Plus size={12} /> Add Paragraph
                </button>
              </div>
            </div>
          )}
          {data.products.length === 0 && (
            <div className="flex-1 flex items-center justify-center border border-[#1e1e1e] rounded-2xl text-[#555] text-sm italic">
              No products yet. Click &ldquo;Add Product&rdquo; above.
            </div>
          )}
        </div>

        {/* RIGHT: Live preview */}
        <div className="flex-1 min-w-0 overflow-hidden rounded-2xl border border-[#1e1e1e] bg-black flex flex-col">
          <div className="px-5 py-3 border-b border-[#1e1e1e] shrink-0 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-widest">
              Live Preview — Products
            </span>
            <span className="text-[10px] text-[#555]">
              {data.products.filter((p) => p.featured).length} featured ·{" "}
              {data.products.length} total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {/* Real Frontend Live Preview */}
            <div className="mx-auto w-full max-w-4xl pt-8 pb-12 relative group border border-transparent p-4 -m-4 rounded-2xl hover:border-gray-200">
              <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black rounded-full px-2 border border-[#1e1e1e] z-10">
                <SectionVisibilityToggle
                  sectionId="products-list"
                  label="Visible"
                />
              </div>
              {data.products.map((p, i) => (
                <div
                  key={p.id}
                  className={`mb-32 ${selected === i ? "ring-4 ring-black ring-offset-4 rounded-xl" : "opacity-30"} transition-all`}
                  onClick={() => setSelected(i)}
                >
                  <h2 className="text-2xl md:text-[28px] font-bold text-black mb-6">
                    {p.name}{" "}
                    <span className="text-sm text-gray-400 font-normal italic ml-2">
                      {p.tagline}
                    </span>
                  </h2>

                  <div
                    className="relative w-full mb-8 overflow-hidden bg-gray-100 rounded-[10px]"
                    style={{ height: "300px" }}
                  >
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-5">
                    {(Array.isArray(p.description)
                      ? p.description
                      : (p.description || "").split("\n\n").filter(Boolean)
                    ).map((para, idx, arr) => (
                      <div
                        key={idx}
                        className="flex items-end justify-between gap-8"
                      >
                        <p className="text-black font-[Poppins] font-normal italic text-[14px] leading-relaxed">
                          {para || "Empty paragraph"}
                        </p>
                        {idx === arr.length - 1 && p.tryUrl && (
                          <div className="shrink-0 inline-flex items-center gap-2 bg-black text-white rounded-full px-5 py-2.5 text-[13px] font-medium whitespace-nowrap">
                            Try it Out →
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
