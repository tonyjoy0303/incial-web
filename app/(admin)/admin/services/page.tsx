"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Plus, Trash2, FileEdit } from "lucide-react";
import { apiGetSection, apiSaveSection } from "@/lib/adminApi";
import type { ServicesData, ServiceSlide } from "@/lib/dataLoader";
import { toast } from "sonner";
import SectionVisibilityToggle from "@/components/admin/SectionVisibilityToggle";
import {
  getServices,
  createService,
  deleteService,
  updateService,
} from "@/lib/actions/service.actions";

const inputCls =
  "w-full bg-transparent border border-[#1e1e1e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-white/50 transition-all font-[Inter,sans-serif]";
const labelCls =
  "text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-wider font-[Inter,sans-serif]";

const SLIDE_COLORS: Record<string, string> = {
  branding: "#2d1b69",
  technology: "#0a1628",
  experience: "#1a0a1e",
};
const SLIDE_ACCENT: Record<string, string> = {
  branding: "#a855f7",
  technology: "#3b82f6",
  experience: "#ec4899",
};

// Types for DB Service
type DBService = {
  id: string;
  title: string;
  description: string;
  isFree: boolean;
  price: number | null;
  createdAt: Date;
  updatedAt: Date;
};

function SlideCard({
  title,
  slide,
  onChange,
}: {
  title: string;
  slide: ServiceSlide;
  onChange: (updated: ServiceSlide) => void;
}) {
  function updateService(idx: number, value: string) {
    const services = [...slide.services];
    services[idx] = value;
    onChange({ ...slide, services });
  }

  return (
    <div className="bg-transparent border border-[#1e1e1e] rounded-2xl p-5 space-y-4">
      <p className="text-white font-semibold text-sm font-[Poppins,sans-serif]">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className={labelCls}>Headline</label>
          <input
            type="text"
            value={slide.headline}
            onChange={(e) => onChange({ ...slide, headline: e.target.value })}
            className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>Subheadline</label>
          <input
            type="text"
            value={slide.subheadline}
            onChange={(e) =>
              onChange({ ...slide, subheadline: e.target.value })
            }
            className={inputCls}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className={labelCls}>Description</label>
        <textarea
          rows={3}
          value={slide.description}
          onChange={(e) => onChange({ ...slide, description: e.target.value })}
          className={`${inputCls} resize-none`}
        />
      </div>
      <div className="space-y-2">
        <label className={labelCls}>Service Tags</label>
        <div className="space-y-2">
          {slide.services.map((svc, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={svc}
                onChange={(e) => updateService(i, e.target.value)}
                className={inputCls}
              />
              <button
                onClick={() =>
                  onChange({
                    ...slide,
                    services: slide.services.filter((_, j) => j !== i),
                  })
                }
                className="text-red-500/70 hover:text-red-500 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              onChange({ ...slide, services: [...slide.services, ""] })
            }
            className="flex items-center gap-2 text-white hover:text-gray-300 text-xs font-medium transition-colors"
          >
            <Plus size={13} /> Add tag
          </button>
        </div>
      </div>
    </div>
  );
}

function SlidePreview({
  slide,
  slideKey,
}: {
  slide: ServiceSlide;
  slideKey: string;
}) {
  const bg = SLIDE_COLORS[slideKey] || "#111";
  const accent = SLIDE_ACCENT[slideKey] || "#fff";
  return (
    <div
      className="rounded-xl overflow-hidden p-6 flex flex-col justify-between min-h-[200px]"
      style={{ background: bg }}
    >
      <div>
        <div className="text-3xl font-bold text-white mb-1 font-[Poppins,sans-serif]">
          {slide.headline || "Headline"}
        </div>
        <div
          className="text-lg font-semibold mb-3 font-[Poppins,sans-serif]"
          style={{ color: accent }}
        >
          {slide.subheadline || "Subheadline"}
        </div>
        <p className="text-white/70 text-sm leading-relaxed mb-4 font-[Inter,sans-serif]">
          {slide.description || "Description…"}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {slide.services.map((svc, i) => (
          <span
            key={i}
            className="text-xs px-3 py-1 rounded-full border font-[Inter,sans-serif]"
            style={{ borderColor: accent, color: accent }}
          >
            {svc}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AdminServicesPage() {
  const [data, setData] = useState<ServicesData | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeSlide, setActiveSlide] = useState<
    "branding" | "technology" | "experience"
  >("branding");

  // Database Services State
  const [dbServices, setDbServices] = useState<DBService[]>([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [showDbForm, setShowDbForm] = useState(false);
  const [editDbId, setEditDbId] = useState<string | null>(null);
  const [dbFormData, setDbFormData] = useState({
    title: "",
    description: "",
    isFree: false,
    price: "" as string | number,
  });

  // Tabs for Page Sections
  const [viewTab, setViewTab] = useState<"slides" | "database">("slides");

  useEffect(() => {
    apiGetSection<ServicesData>("services")
      .then(setData)
      .catch(() => {});

    fetchDbServices();
  }, []);

  async function fetchDbServices() {
    setDbLoading(true);
    const result = await getServices();
    if (result.success && result.data) {
      setDbServices(result.data);
    }
    setDbLoading(false);
  }

  // --- Slide Logic ---
  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      await apiSaveSection("services", data);
      toast.success("Services section saved!");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  // --- Database Service Logic ---
  function handleEditDbService(service: DBService) {
    setDbFormData({
      title: service.title,
      description: service.description,
      isFree: service.isFree,
      price: service.price || "",
    });
    setEditDbId(service.id);
    setShowDbForm(true);
  }

  function handleCancelDbService() {
    setShowDbForm(false);
    setEditDbId(null);
    setDbFormData({ title: "", description: "", isFree: false, price: "" });
  }

  async function handleSubmitDbService(e: React.FormEvent) {
    e.preventDefault();
    if (!dbFormData.title || !dbFormData.description) {
      toast.error("Title and description are required");
      return;
    }

    setSaving(true);

    const submitData = {
      title: dbFormData.title,
      description: dbFormData.description,
      isFree: dbFormData.isFree,
      price: dbFormData.isFree ? null : Number(dbFormData.price) || null,
    };

    let result;
    if (editDbId) {
      result = await updateService(editDbId, submitData);
    } else {
      result = await createService(submitData);
    }

    if (result.success) {
      toast.success(`Service ${editDbId ? "updated" : "created"}!`);
      handleCancelDbService();
      fetchDbServices();
    } else {
      toast.error(result.error || "Operation failed");
    }
    setSaving(false);
  }

  async function handleDeleteDbService(id: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;

    setSaving(true);
    const result = await deleteService(id);

    if (result.success) {
      toast.success("Service deleted");
      fetchDbServices();
    } else {
      toast.error("Failed to delete service");
    }
    setSaving(false);
  }

  if (!data || dbLoading)
    return (
      <div className="flex items-center justify-center h-40 text-white/40">
        <Loader2 size={20} className="animate-spin mr-2" /> Loading…
      </div>
    );

  const slides = {
    branding: data.branding,
    technology: data.technology,
    experience: data.experience,
  };
  const slideTitles = {
    branding: "Branding Slide",
    technology: "Technology Slide",
    experience: "Experience Slide",
  };

  return (
    <div className="flex flex-col h-full gap-0 font-[Inter,sans-serif]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white font-[Poppins,sans-serif]">
            Services Section
          </h2>
          <p className="text-[#8e8e8e] text-sm mt-1">
            Manage your service slides and detailed service items.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <SectionVisibilityToggle
            sectionId="scrolling"
            label="Visible on Home"
          />
          {viewTab === "slides" && (
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
              Save Slides
            </button>
          )}
          {viewTab === "database" && !showDbForm && (
            <button
              onClick={() => setShowDbForm(true)}
              className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              <Plus size={15} />
              Add Detailed Service
            </button>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-[#1e1e1e] mb-6 shrink-0">
        <button
          onClick={() => setViewTab("slides")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            viewTab === "slides"
              ? "border-white text-white"
              : "border-transparent text-[#8e8e8e] hover:text-white"
          }`}
        >
          Homepage Slides
        </button>
        <button
          onClick={() => setViewTab("database")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            viewTab === "database"
              ? "border-white text-white"
              : "border-transparent text-[#8e8e8e] hover:text-white"
          }`}
        >
          Detailed Services (DB)
        </button>
      </div>

      {viewTab === "slides" ? (
        /* ── Split layout (Slides) ── */
        <div className="flex gap-8 flex-1 min-h-0">
          {/* LEFT: Form */}
          <div className="w-[420px] shrink-0 overflow-y-auto pr-2 space-y-5">
            {/* Intro */}
            <div className="bg-transparent border border-[#1e1e1e] rounded-2xl p-5 space-y-4">
              <p className="text-white font-semibold text-sm font-[Poppins,sans-serif]">
                Intro Slide
              </p>
              <div className="space-y-1.5">
                <label className={labelCls}>Title</label>
                <input
                  type="text"
                  value={data.introTitle}
                  onChange={(e) =>
                    setData({ ...data, introTitle: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelCls}>Subtitle</label>
                <input
                  type="text"
                  value={data.introSubtitle}
                  onChange={(e) =>
                    setData({ ...data, introSubtitle: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
            </div>

            {/* Slide tabs */}
            <div className="flex gap-2">
              {(["branding", "technology", "experience"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setActiveSlide(k)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                    activeSlide === k
                      ? "bg-white text-black"
                      : "border border-[#1e1e1e] text-[#8e8e8e] hover:text-white"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <SlideCard
              title={slideTitles[activeSlide]}
              slide={slides[activeSlide]}
              onChange={(updated) =>
                setData({ ...data, [activeSlide]: updated })
              }
            />
          </div>

          {/* RIGHT: Live preview */}
          <div className="flex-1 min-w-0 overflow-hidden rounded-2xl border border-[#1e1e1e] bg-black flex flex-col">
            <div className="px-5 py-3 border-b border-[#1e1e1e] flex items-center justify-between shrink-0">
              <span className="text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-widest">
                Live Preview — Services
              </span>
              <div className="flex gap-2">
                {(["branding", "technology", "experience"] as const).map(
                  (k) => (
                    <button
                      key={k}
                      onClick={() => setActiveSlide(k)}
                      className={`text-[10px] px-3 py-1 rounded-full transition-colors capitalize font-semibold ${
                        activeSlide === k
                          ? "bg-white text-black"
                          : "border border-[#1e1e1e] text-[#8e8e8e] hover:text-white"
                      }`}
                    >
                      {k}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Intro preview */}
              <div className="border border-[#1e1e1e] rounded-xl p-6 bg-black">
                <div className="text-[#8e8e8e] text-xs uppercase tracking-widest mb-2">
                  Services
                </div>
                <h2 className="text-4xl font-bold text-white font-[Poppins,sans-serif] mb-1">
                  {data.introTitle || "What We Do"}
                </h2>
                <p className="text-[#8e8e8e] text-sm font-[Inter,sans-serif]">
                  {data.introSubtitle || "Our core offerings"}
                </p>
              </div>

              {/* Active slide preview */}
              <SlidePreview
                slide={slides[activeSlide]}
                slideKey={activeSlide}
              />

              {/* Other slides dim preview */}
              <div className="grid grid-cols-2 gap-3 opacity-40">
                {(["branding", "technology", "experience"] as const)
                  .filter((k) => k !== activeSlide)
                  .map((k) => (
                    <SlidePreview key={k} slide={slides[k]} slideKey={k} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Database Services ── */
        <div className="flex-1 min-h-0 overflow-y-auto pr-4">
          {showDbForm ? (
            <div className="bg-transparent border border-[#1e1e1e] rounded-2xl p-6 max-w-2xl">
              <form onSubmit={handleSubmitDbService} className="space-y-5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-semibold font-[Poppins,sans-serif]">
                    {editDbId ? "Edit Service" : "Create New Service"}
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <label className={labelCls}>Service Title *</label>
                  <input
                    type="text"
                    value={dbFormData.title}
                    onChange={(e) =>
                      setDbFormData({ ...dbFormData, title: e.target.value })
                    }
                    placeholder="e.g. Free Consultation"
                    className={inputCls}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelCls}>Description *</label>
                  <textarea
                    rows={4}
                    value={dbFormData.description}
                    onChange={(e) =>
                      setDbFormData({
                        ...dbFormData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe what this service entails..."
                    className={`${inputCls} resize-none`}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex items-center gap-3 pt-4">
                    <input
                      type="checkbox"
                      id="isFree"
                      checked={dbFormData.isFree}
                      onChange={(e) =>
                        setDbFormData({
                          ...dbFormData,
                          isFree: e.target.checked,
                          price: e.target.checked ? "" : dbFormData.price,
                        })
                      }
                      className="w-4 h-4 rounded border-[#1e1e1e] bg-black text-white focus:ring-offset-black focus:ring-white"
                    />
                    <label
                      htmlFor="isFree"
                      className="text-white text-sm cursor-pointer"
                    >
                      This is a Free Service
                    </label>
                  </div>

                  {!dbFormData.isFree && (
                    <div className="space-y-1.5 flex-1">
                      <label className={labelCls}>Price (Optional)</label>
                      <input
                        type="number"
                        value={dbFormData.price}
                        onChange={(e) =>
                          setDbFormData({
                            ...dbFormData,
                            price: e.target.value,
                          })
                        }
                        placeholder="e.g. 500"
                        className={inputCls}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4 border-t border-[#1e1e1e] mt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-gray-200 disabled:opacity-50 text-black text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors min-w-[120px]"
                  >
                    {saving ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Save size={15} />
                    )}
                    {editDbId ? "Update" : "Save"} Service
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelDbService}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 bg-transparent border border-[#1e1e1e] hover:bg-[#1e1e1e] disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl">
              {dbServices.length === 0 ? (
                <div className="text-center py-12 border border-[#1e1e1e] border-dashed rounded-2xl bg-[#0a0a0a]">
                  <p className="text-[#8e8e8e] mb-4">
                    No detailed services created yet.
                  </p>
                  <button
                    onClick={() => setShowDbForm(true)}
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-200 text-black text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                  >
                    <Plus size={15} /> Add Your First Service
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dbServices.map((service) => (
                    <div
                      key={service.id}
                      className="border border-[#1e1e1e] rounded-2xl p-6 bg-[#0a0a0a] flex flex-col hover:border-white/20 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-white font-semibold font-[Poppins,sans-serif] text-lg pr-4">
                          {service.title}
                        </h3>
                        {service.isFree ? (
                          <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 whitespace-nowrap">
                            Free
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 whitespace-nowrap">
                            {service.price ? `$${service.price}` : "Paid"}
                          </span>
                        )}
                      </div>

                      <p className="text-[#8e8e8e] text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e1e1e]">
                        <button
                          onClick={() => handleEditDbService(service)}
                          className="text-[#8e8e8e] hover:text-white transition-colors p-1.5"
                          title="Edit"
                        >
                          <FileEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteDbService(service.id)}
                          disabled={saving}
                          className="text-red-500/60 hover:text-red-500 transition-colors p-1.5"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
