"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Power } from "lucide-react";
import { apiGetSection, apiSaveSection } from "@/lib/adminApi";
import type { SectionsConfig, SectionConfig } from "@/lib/dataLoader";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [data, setData] = useState<SectionsConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGetSection<SectionsConfig>("sections")
      .then(setData)
      .catch(() => {});
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      await apiSaveSection("sections", data);
      toast.success("Section settings saved!");
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  function toggleSection(sectionId: string) {
    if (!data) return;
    const sections = [...data.sections];
    const idx = sections.findIndex((s) => s.id === sectionId);
    if (idx === -1) return;
    // Don't allow disabling the main intro/services scroll section completely
    if (sections[idx].id === "scrolling" && sections[idx].enabled) {
      toast.error("The home hero section cannot be disabled.");
      return;
    }
    sections[idx].enabled = !sections[idx].enabled;
    setData({ ...data, sections });
  }

  if (!data)
    return (
      <div className="flex items-center justify-center h-40 text-white/40">
        <Loader2 size={20} className="animate-spin mr-2" /> Loading…
      </div>
    );

  return (
    <div className="max-w-2xl font-[Inter,sans-serif]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white font-[Poppins,sans-serif]">
            Section Settings
          </h2>
          <p className="text-[#8e8e8e] text-sm mt-1">
            Enable or disable main sections on the live website.
          </p>
        </div>
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

      <div className="bg-transparent border border-[#1e1e1e] rounded-3xl overflow-hidden mb-12">
        <div className="px-6 py-4 border-b border-[#1e1e1e] flex items-center justify-between bg-[#0a0a0a]">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-[Poppins,sans-serif]">
            Website Sections
          </h3>
          <span className="text-xs text-[#8e8e8e]">
            {data.sections.filter((s) => s.enabled).length} active
          </span>
        </div>

        <div className="divide-y divide-[#1e1e1e]">
          {(() => {
            const groupedSections = data.sections.reduce(
              (acc, section) => {
                let group = "Other Pages";
                const id = section.id.toLowerCase();
                if (id === "scrolling") group = "Home Page";
                else if (id.startsWith("about")) group = "About Page";
                else if (id.startsWith("blog")) group = "Blogs Page";
                else if (id.startsWith("client")) group = "Clients Page";
                else if (id.startsWith("trust")) group = "Trust Page";
                else if (id.startsWith("product")) group = "Products Page";
                else if (id.startsWith("casestud")) group = "Case Studies Page";

                if (!acc[group]) acc[group] = [];
                acc[group].push(section);
                return acc;
              },
              {} as Record<string, typeof data.sections>,
            );

            const order = [
              "Home Page",
              "About Page",
              "Blogs Page",
              "Clients Page",
              "Trust Page",
              "Products Page",
              "Case Studies Page",
              "Other Pages",
            ];

            return order
              .filter((group) => groupedSections[group]?.length > 0)
              .map((group) => (
                <div key={group} className="flex flex-col">
                  <div className="px-5 py-2.5 bg-[#141414] border-b border-t border-[#1e1e1e] first:border-t-0">
                    <span className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider">
                      {group}
                    </span>
                  </div>
                  {groupedSections[group]
                    .sort((a, b) => a.id.length - b.id.length)
                    .map((section) => (
                      <div
                        key={section.id}
                        className="p-5 flex items-center justify-between hover:bg-[#0a0a0a]/50 transition-colors border-b border-[#1e1e1e] last:border-b-0"
                      >
                        <div>
                          <p
                            className={`font-semibold text-sm font-[Poppins,sans-serif] ${section.enabled ? "text-white" : "text-[#555]"}`}
                          >
                            {section.label}
                          </p>
                          <p className="text-xs text-[#8e8e8e] mt-1">
                            ID: {section.id}
                          </p>
                        </div>

                        <button
                          onClick={() => toggleSection(section.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            section.enabled ? "bg-white" : "bg-[#2e2e2e]"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                              section.enabled
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                </div>
              ));
          })()}
        </div>
      </div>
    </div>
  );
}
