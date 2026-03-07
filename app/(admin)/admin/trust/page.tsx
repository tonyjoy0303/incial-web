"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { apiGetSection, apiSaveSection } from "@/lib/adminApi";
import type { TrustData, Stat } from "@/lib/dataLoader";
import { toast } from "sonner";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden mb-4">
      <div className="px-5 py-3 border-b border-white/5">
        <h3 className="text-sm font-semibold text-white/70">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

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
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">
            Training & Trust Stats
          </h2>
          <p className="text-white/40 text-xs mt-0.5">
            The numbers shown in the &quot;Why Trust Incial?&quot; section.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          Save Changes
        </button>
      </div>

      <Card title="Section Title">
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          placeholder="Why Trust Incial?"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/90 text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all"
        />
      </Card>

      <Card title="Stats">
        <p className="text-xs text-white/40 -mt-2">
          These are the big numbers displayed prominently (e.g. &quot;50+ Happy
          Clients&quot;).
        </p>
        <div className="space-y-3">
          {data.stats.map((stat, i) => (
            <div
              key={stat.id}
              className="flex items-center gap-4 bg-green-500/5 border border-green-500/10 rounded-xl p-4"
            >
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-white/40">
                    Value
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(i, "value", e.target.value)}
                    placeholder="50+"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-green-400 font-bold text-lg placeholder-white/20 focus:outline-none focus:border-green-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-white/40">
                    Label
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                    placeholder="Happy Clients"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-green-500/50 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={() => removeStat(i)}
                className="text-red-400/50 hover:text-red-400 transition-colors shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addStat}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          <Plus size={15} /> Add Stat
        </button>
      </Card>

      {/* Preview */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 mt-2">
        <p className="text-xs text-white/30 mb-4 uppercase tracking-wider">
          Live Preview
        </p>
        <h3 className="text-white/60 text-2xl font-light italic text-center mb-6">
          {data.title}
        </h3>
        <div className="flex justify-between w-full">
          {data.stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-5xl font-bold text-[#5ba4e6] italic">
                {stat.value}
              </div>
              <div className="text-white/70 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
