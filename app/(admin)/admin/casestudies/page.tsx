"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Save, Plus, Trash2, Star, StarOff } from "lucide-react";
import { apiGetSection, apiSaveSection } from "@/lib/adminApi";
import type { CaseStudiesData, CaseStudy } from "@/lib/dataLoader";
import { toast } from "sonner";
import SectionVisibilityToggle from "@/components/admin/SectionVisibilityToggle";
import ImageUpload from "@/components/admin/ImageUpload";
const inputCls =
  "w-full bg-transparent border border-[#1e1e1e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-white/50 transition-all font-[Inter,sans-serif]";
const labelCls =
  "text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-wider font-[Inter,sans-serif]";

function newCase(): CaseStudy {
  return {
    id: String(Date.now()),
    slug: "",
    title: "",
    category: "",
    heroQuote: "",
    heroImage: "",
    introduction: "",
    sections: [],
    location: "",
    featured: false,
  };
}

export default function AdminCaseStudiesPage() {
  const [data, setData] = useState<CaseStudiesData | null>(null);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    apiGetSection<CaseStudiesData>("casestudies")
      .then(setData)
      .catch(() => {});
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      await apiSaveSection("casestudies", data);
      toast.success("Case studies saved!");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  function updateCase(field: keyof CaseStudy, value: any) {
    if (!data) return;
    const cases = [...data.cases];
    cases[selected] = { ...cases[selected], [field]: value };
    setData({ ...data, cases });
  }

  function addSection(caseIdx: number) {
    if (!data) return;
    const cases = [...data.cases];
    const sections = [
      ...(cases[caseIdx].sections || []),
      { title: "", content: "" },
    ];
    cases[caseIdx] = { ...cases[caseIdx], sections };
    setData({ ...data, cases });
  }

  function updateSection(
    caseIdx: number,
    sectionIdx: number,
    field: "title" | "content",
    value: string,
  ) {
    if (!data) return;
    const cases = [...data.cases];
    const sections = [...cases[caseIdx].sections];
    sections[sectionIdx] = { ...sections[sectionIdx], [field]: value };
    cases[caseIdx] = { ...cases[caseIdx], sections };
    setData({ ...data, cases });
  }

  function removeSection(caseIdx: number, sectionIdx: number) {
    if (!data) return;
    const cases = [...data.cases];
    const sections = cases[caseIdx].sections.filter((_, i) => i !== sectionIdx);
    cases[caseIdx] = { ...cases[caseIdx], sections };
    setData({ ...data, cases });
  }

  function addCase() {
    if (!data) return;
    const next = [...data.cases, newCase()];
    setData({ ...data, cases: next });
    setSelected(next.length - 1);
  }

  function removeCase(idx: number) {
    if (!data) return;
    const next = data.cases.filter((_, i) => i !== idx);
    setData({ ...data, cases: next });
    setSelected(Math.min(selected, Math.max(0, next.length - 1)));
  }

  if (!data)
    return (
      <div className="flex items-center justify-center h-40 text-white/40">
        <Loader2 size={20} className="animate-spin mr-2" /> Loading…
      </div>
    );

  const active = data.cases[selected];

  return (
    <div className="flex flex-col h-full gap-0 font-[Inter,sans-serif]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white font-[Poppins,sans-serif]">
            Case Studies
          </h2>
          <p className="text-[#8e8e8e] text-sm mt-1">
            {data.cases.length} case
            {data.cases.length === 1 ? " study" : " studies"} ·{" "}
            {data.cases.filter((c) => c.featured).length} featured
          </p>
        </div>
        <div className="flex items-center gap-6">
          <SectionVisibilityToggle sectionId="casestudies" />
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
        {/* LEFT: Case list + editor */}
        <div className="w-[440px] shrink-0 flex flex-col gap-4 overflow-hidden">
          {/* Case list tabs */}
          <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1 shrink-0">
            {data.cases.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setSelected(i)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all group ${
                  selected === i
                    ? "bg-white text-black"
                    : "border border-[#1e1e1e] text-[#8e8e8e] hover:text-white hover:bg-[#0a0a0a]"
                }`}
              >
                {c.featured ? (
                  <Star
                    size={12}
                    className={`shrink-0 ${selected === i ? "fill-black text-black" : "fill-white text-white"}`}
                  />
                ) : (
                  <div className="w-3 h-3 shrink-0" />
                )}
                <span className="flex-1 text-sm font-medium truncate font-[Poppins,sans-serif]">
                  {c.title || `Case Study ${i + 1}`}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider ${selected === i ? "text-black/50" : "text-[#555]"}`}
                >
                  {c.category || "General"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCase(i);
                  }}
                  className={`shrink-0 ${selected === i ? "text-red-500" : "text-red-500/0 group-hover:text-red-500/70"}`}
                >
                  <Trash2 size={12} />
                </button>
              </button>
            ))}
            <button
              onClick={addCase}
              className="flex items-center gap-2 px-4 py-2 text-xs text-white hover:text-gray-300 font-medium transition-colors"
            >
              <Plus size={13} /> Add Case Study
            </button>
          </div>

          {/* Editor form for selected case */}
          {active && (
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 border border-[#1e1e1e] rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className={labelCls}>
                  Editing: Case Study {selected + 1}
                </span>
                <button
                  onClick={() => updateCase("featured", !active.featured)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                    active.featured
                      ? "bg-white text-black"
                      : "border border-[#1e1e1e] text-[#8e8e8e] hover:text-white"
                  }`}
                >
                  {active.featured ? (
                    <>
                      <Star size={11} className="fill-black text-black" />{" "}
                      Featured
                    </>
                  ) : (
                    <>
                      <StarOff size={11} /> Set Featured
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className={labelCls}>Title</label>
                  <input
                    type="text"
                    value={active.title}
                    onChange={(e) => updateCase("title", e.target.value)}
                    placeholder="Project title"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Slug (URL)</label>
                  <input
                    type="text"
                    value={active.slug}
                    onChange={(e) => updateCase("slug", e.target.value)}
                    placeholder="my-project"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className={labelCls}>Category</label>
                  <input
                    type="text"
                    value={active.category}
                    onChange={(e) => updateCase("category", e.target.value)}
                    placeholder="Branding / Technology"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Location</label>
                  <input
                    type="text"
                    value={active.location || ""}
                    onChange={(e) => updateCase("location", e.target.value)}
                    placeholder="Kerala, India"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <ImageUpload
                  label="Hero Image"
                  value={active.heroImage}
                  onChange={(v) => updateCase("heroImage", v)}
                  folder="images/case-studies"
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelCls}>Hero Quote (Summary)</label>
                <textarea
                  rows={3}
                  value={active.heroQuote}
                  onChange={(e) => updateCase("heroQuote", e.target.value)}
                  placeholder="How do you take a traditional..."
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelCls}>Introduction</label>
                <textarea
                  rows={4}
                  value={active.introduction}
                  onChange={(e) => updateCase("introduction", e.target.value)}
                  placeholder="Client was a home decor brand..."
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-[#1e1e1e]">
                <label className={labelCls}>Content Sections</label>
                {(active.sections || []).map((sec, si) => (
                  <div
                    key={si}
                    className="flex flex-col gap-2 p-3 border border-[#1e1e1e] rounded-xl bg-[#050505] relative group"
                  >
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) =>
                        updateSection(selected, si, "title", e.target.value)
                      }
                      placeholder="Section Title (optional)"
                      className={`${inputCls} py-1.5`}
                    />
                    <textarea
                      rows={3}
                      value={sec.content}
                      onChange={(e) =>
                        updateSection(selected, si, "content", e.target.value)
                      }
                      placeholder="Section Content"
                      className={`${inputCls} py-1.5 resize-none`}
                    />
                    <button
                      onClick={() => removeSection(selected, si)}
                      className="absolute top-3 right-3 text-red-500/0 group-hover:text-red-500/70 hover:!text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addSection(selected)}
                  className="mt-2 flex items-center justify-center w-full gap-2 px-4 py-2 border border-[#1e1e1e] border-dashed rounded-xl text-xs text-[#8e8e8e] hover:text-white hover:border-[#333] transition-all"
                >
                  <Plus size={13} /> Add Content Section
                </button>
              </div>
            </div>
          )}
          {data.cases.length === 0 && (
            <div className="flex-1 flex items-center justify-center border border-[#1e1e1e] rounded-2xl text-[#555] text-sm italic">
              No case studies yet. Click &ldquo;Add Case Study&rdquo; above.
            </div>
          )}
        </div>

        {/* RIGHT: Live preview */}
        <div className="flex-1 min-w-0 overflow-hidden rounded-2xl border border-[#1e1e1e] bg-black flex flex-col">
          <div className="px-5 py-3 border-b border-[#1e1e1e] shrink-0 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-widest">
              Live Preview — Case Studies
            </span>
            <span className="text-[10px] text-[#555]">
              {data.cases.filter((c) => c.featured).length} featured ·{" "}
              {data.cases.length} total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a]">
            {active && (
              <div
                className={`mx-auto max-w-2xl bg-black rounded-xl overflow-hidden border border-[#1e1e1e] pb-10 shadow-xl`}
              >
                <div className="relative w-full h-[220px]">
                  {active.heroImage ? (
                    <Image
                      src={active.heroImage}
                      alt={active.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#111] text-[#555]">
                      No Hero Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    <h1 className="text-white font-[Poppins] font-bold text-2xl">
                      {active.title || "Untitled Title"}
                    </h1>
                    <p className="text-white font-[Poppins] italic text-sm line-clamp-3">
                      "{active.heroQuote || "Hero quote text goes here"}"
                    </p>
                  </div>
                </div>

                <div className="px-6 pt-8 space-y-6">
                  {active.introduction && (
                    <p className="text-gray-300 font-[Poppins] text-sm leading-relaxed">
                      {active.introduction}
                    </p>
                  )}

                  <div className="space-y-6 mt-6">
                    {(active.sections || []).map((sec, idx) => (
                      <section key={idx}>
                        {sec.title && (
                          <h2 className="text-white font-[Poppins] font-bold text-base mb-2">
                            {sec.title}
                          </h2>
                        )}
                        {sec.content && (
                          <p className="text-gray-300 font-[Poppins] text-sm leading-relaxed">
                            {sec.content}
                          </p>
                        )}
                      </section>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Grid preview for the rest */}
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-4 border-t border-[#1e1e1e] pt-6 relative group border border-transparent p-4 -m-4 rounded-2xl hover:border-[#1e1e1e]">
              <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black rounded-full px-2 border border-[#1e1e1e] z-10">
                <SectionVisibilityToggle
                  sectionId="casestudies-list"
                  label="Visible"
                />
              </div>
              {data.cases.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(i)}
                  className={`border rounded-xl overflow-hidden text-left transition-all ${selected === i ? "border-white" : "border-[#1e1e1e] hover:border-[#333]"}`}
                >
                  <div className="h-24 bg-[#111] relative overflow-hidden">
                    {c.heroImage ? (
                      <Image
                        src={c.heroImage}
                        alt={c.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#555] text-[10px]">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-[#050505]">
                    <div className="flex items-center gap-1 mb-1">
                      {c.featured && (
                        <Star
                          size={9}
                          className="fill-white text-white shrink-0"
                        />
                      )}
                      <span className="text-[9px] font-semibold text-[#555] uppercase tracking-wider truncate">
                        {c.category}
                      </span>
                    </div>
                    <p className="text-white text-xs font-semibold font-[Poppins,sans-serif] leading-tight line-clamp-1">
                      {c.title || "Untitled"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
