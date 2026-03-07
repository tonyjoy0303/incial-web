"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { apiGetSection, apiSaveSection } from "@/lib/adminApi";
import type { TrustData, Stat } from "@/lib/dataLoader";
import { toast } from "sonner";
import SectionVisibilityToggle from "@/components/admin/SectionVisibilityToggle";

const inputCls =
  "w-full bg-transparent border border-[#1e1e1e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-white/50 transition-all font-[Inter,sans-serif]";
const labelCls =
  "text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-wider font-[Inter,sans-serif]";

export default function AdminTrustPage() {
  const [data, setData] = useState<TrustData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGetSection<TrustData>("trust")
      .then(setData)
      .catch(() => {});
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      await apiSaveSection("trust", data);
      toast.success("Training stats saved!");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  function updateStat(idx: number, field: keyof Stat, value: string) {
    if (!data) return;
    const stats = [...data.stats];
    stats[idx] = { ...stats[idx], [field]: value };
    setData({ ...data, stats });
  }

  function addStat() {
    if (!data) return;
    setData({
      ...data,
      stats: [...data.stats, { id: String(Date.now()), value: "", label: "" }],
    });
  }

  function removeStat(idx: number) {
    if (!data) return;
    setData({ ...data, stats: data.stats.filter((_, i) => i !== idx) });
  }

  if (!data)
    return (
      <div className="flex items-center justify-center h-40 text-white/40">
        <Loader2 size={20} className="animate-spin mr-2" /> Loading…
      </div>
    );

  return (
    <div className="flex flex-col h-full gap-0 font-[Inter,sans-serif]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white font-[Poppins,sans-serif]">
            Training & Trust Stats
          </h2>
          <p className="text-[#8e8e8e] text-sm mt-1">
            The numbers shown in the "Why Trust Incial?" section.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <SectionVisibilityToggle sectionId="trust" />
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
      <div className="flex gap-8 flex-1 min-h-0">
        {/* LEFT: Form */}
        <div className="w-[420px] shrink-0 overflow-y-auto pr-2 space-y-5">
          {/* Title */}
          <div className="bg-transparent border border-[#1e1e1e] rounded-2xl p-5">
            <p className="text-white font-semibold text-sm mb-4 font-[Poppins,sans-serif]">
              Section Title
            </p>
            <div className="space-y-1.5">
              <label className={labelCls}>Title</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Why Trust Incial?"
                className={inputCls}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="bg-transparent border border-[#1e1e1e] rounded-2xl p-5">
            <p className="text-white font-semibold text-sm mb-4 font-[Poppins,sans-serif]">
              Stats
            </p>
            <p className="text-xs text-[#8e8e8e] mb-4 leading-relaxed">
              Big numbers shown on the website, e.g. "50+ Happy Clients".
            </p>
            <div className="space-y-3">
              {data.stats.map((stat, i) => (
                <div
                  key={stat.id}
                  className="flex items-center gap-3 border border-[#1e1e1e] rounded-xl p-4"
                >
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className={labelCls}>Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStat(i, "value", e.target.value)}
                        placeholder="50+"
                        className="w-full bg-transparent border border-[#1e1e1e] rounded-xl px-3 py-2 text-white font-bold text-lg placeholder-[#555] focus:outline-none focus:border-white/50 transition-all font-[Poppins,sans-serif]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelCls}>Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStat(i, "label", e.target.value)}
                        placeholder="Happy Clients"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeStat(i)}
                    className="text-red-500/70 hover:text-red-500 shrink-0 ml-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={addStat}
                className="flex items-center gap-2 text-white hover:text-gray-300 text-xs font-medium mt-1 transition-colors"
              >
                <Plus size={13} /> Add Stat
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Live preview mirroring main site exactly */}
        <div className="flex-1 min-w-0 overflow-hidden rounded-2xl border border-[#1e1e1e] bg-black flex flex-col">
          <div className="px-5 py-3 border-b border-[#1e1e1e] shrink-0">
            <span className="text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-widest">
              Live Preview — Trust Section
            </span>
          </div>

          {/* Exact replica of TrustSection layout */}
          <div className="flex-1 flex flex-col justify-center items-center px-8 py-10">
            <div className="text-center mb-16 md:mb-24 relative group border border-transparent p-2 -m-2 rounded-2xl hover:border-[#1e1e1e]">
              <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black rounded-full px-2 border border-[#1e1e1e] z-10">
                <SectionVisibilityToggle
                  sectionId="trust-title"
                  label="Visible"
                />
              </div>
              <h2 className="text-5xl md:text-6xl font-light tracking-tight italic text-white font-[Poppins,sans-serif]">
                {data.title || "Why Trust Incial?"}
              </h2>
            </div>

            <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-12 text-center w-full max-w-3xl relative group border border-transparent p-4 -m-4 rounded-2xl hover:border-[#1e1e1e]">
              <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black rounded-full px-2 border border-[#1e1e1e] z-10">
                <SectionVisibilityToggle
                  sectionId="trust-stats"
                  label="Visible"
                />
              </div>
              {data.stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center min-w-[150px]"
                >
                  <div className="text-6xl font-bold text-[#5ba4e6] mb-3 italic tracking-tighter font-[Poppins,sans-serif]">
                    {stat.value || "—"}
                  </div>
                  <div className="text-lg text-white font-normal font-[Poppins,sans-serif]">
                    {stat.label || "Label"}
                  </div>
                </div>
              ))}
              {data.stats.length === 0 && (
                <p className="col-span-3 text-[#8e8e8e] text-sm italic w-full text-center">
                  No stats yet. Add some on the left.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
