"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { apiGetSection, apiSaveSection } from "@/lib/adminApi";
import type { ClientsData, Client, Testimonial } from "@/lib/dataLoader";
import { toast } from "sonner";
import SectionVisibilityToggle from "@/components/admin/SectionVisibilityToggle";
import ImageUpload from "@/components/admin/ImageUpload";
const inputCls =
  "w-full bg-transparent border border-[#1e1e1e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-white/50 transition-all font-[Inter,sans-serif]";
const labelCls =
  "text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-wider font-[Inter,sans-serif]";

function SortableClientItem({ client }: { client: Client }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: client.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-[5px] flex items-center justify-center aspect-[3/2] relative overflow-hidden cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-white/50 transition-all select-none touch-none"
    >
      {client.src ? (
        <Image
          src={client.src}
          alt={client.name}
          fill
          sizes="150px"
          quality={60}
          className="object-contain p-2 pointer-events-none"
        />
      ) : (
        <span className="text-[8px] text-gray-400 text-center px-1 leading-tight pointer-events-none">
          {client.name || "Logo"}
        </span>
      )}
    </div>
  );
}

export default function AdminClientsPage() {
  const [data, setData] = useState<ClientsData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGetSection<ClientsData>("clients")
      .then(setData)
      .catch(() => {});
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setData((prev) => {
        if (!prev) return prev;
        const oldIndex = prev.clients.findIndex((c) => c.id === active.id);
        const newIndex = prev.clients.findIndex((c) => c.id === over.id);

        return {
          ...prev,
          clients: arrayMove(prev.clients, oldIndex, newIndex),
        };
      });
    }
  }

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      await apiSaveSection("clients", data);
      toast.success("Clients section saved!");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  function updateClient(idx: number, field: keyof Client, value: string) {
    if (!data) return;
    const clients = [...data.clients];
    clients[idx] = { ...clients[idx], [field]: value };
    setData({ ...data, clients });
  }

  function addClient() {
    if (!data) return;
    setData({
      ...data,
      clients: [...data.clients, { id: String(Date.now()), name: "", src: "" }],
    });
  }

  function removeClient(idx: number) {
    if (!data) return;
    setData({ ...data, clients: data.clients.filter((_, i) => i !== idx) });
  }

  function updateTestimonial(
    idx: number,
    field: keyof Testimonial,
    value: string,
  ) {
    if (!data) return;
    const testimonials = [...data.testimonials];
    testimonials[idx] = { ...testimonials[idx], [field]: value };
    setData({ ...data, testimonials });
  }

  function addTestimonial() {
    if (!data) return;
    setData({
      ...data,
      testimonials: [
        ...data.testimonials,
        { id: String(Date.now()), quote: "", author: "" },
      ],
    });
  }

  function removeTestimonial(idx: number) {
    if (!data) return;
    setData({
      ...data,
      testimonials: data.testimonials.filter((_, i) => i !== idx),
    });
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
            Clients Section
          </h2>
          <p className="text-[#8e8e8e] text-sm mt-1">
            Manage client logos and testimonials.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <SectionVisibilityToggle sectionId="client" />
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
        <div className="w-[420px] shrink-0 overflow-y-auto pr-2 space-y-6">
          {/* Header text */}
          <div className="bg-transparent border border-[#1e1e1e] rounded-2xl p-5">
            <p className="text-white font-semibold text-sm mb-4 font-[Poppins,sans-serif]">
              Section Header
            </p>
            <div className="space-y-1.5">
              <label className={labelCls}>Header Text</label>
              <input
                type="text"
                value={data.headerText}
                onChange={(e) =>
                  setData({ ...data, headerText: e.target.value })
                }
                placeholder="Some of Our Awesome Clients:"
                className={inputCls}
              />
            </div>
          </div>

          {/* Clients */}
          <div className="bg-transparent border border-[#1e1e1e] rounded-2xl p-5">
            <p className="text-white font-semibold text-sm mb-4 font-[Poppins,sans-serif]">
              Client Logos ({data.clients.length})
            </p>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {data.clients.map((client, i) => (
                <div
                  key={client.id}
                  className="flex items-center gap-3 border border-[#1e1e1e] rounded-xl p-3"
                >
                  <div className="w-12 h-9 bg-white rounded-md relative overflow-hidden shrink-0">
                    {client.src && (
                      <Image
                        src={client.src}
                        alt={client.name}
                        fill
                        sizes="50px"
                        quality={60}
                        className="object-contain p-1"
                      />
                    )}
                  </div>
                  <div className="flex-1 w-full min-w-[200px]">
                    <ImageUpload
                      label="Logo Upload"
                      value={client.src}
                      onChange={(v) => updateClient(i, "src", v)}
                      folder="clients"
                    />
                  </div>
                  <button
                    onClick={() => removeClient(i)}
                    className="text-red-500/70 hover:text-red-500 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addClient}
              className="flex items-center gap-2 text-white hover:text-gray-300 text-xs font-medium mt-3 transition-colors"
            >
              <Plus size={13} /> Add Client
            </button>
          </div>

          {/* Testimonials */}
          <div className="bg-transparent border border-[#1e1e1e] rounded-2xl p-5">
            <p className="text-white font-semibold text-sm mb-4 font-[Poppins,sans-serif]">
              Testimonials
            </p>
            <div className="space-y-3">
              {data.testimonials.map((t, i) => (
                <div
                  key={t.id}
                  className="border border-[#1e1e1e] rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className={labelCls}>Testimonial {i + 1}</span>
                    <button
                      onClick={() => removeTestimonial(i)}
                      className="text-red-500/70 hover:text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Quote</label>
                    <textarea
                      rows={3}
                      value={t.quote}
                      onChange={(e) =>
                        updateTestimonial(i, "quote", e.target.value)
                      }
                      placeholder="Client testimonial..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Author</label>
                    <input
                      type="text"
                      value={t.author}
                      onChange={(e) =>
                        updateTestimonial(i, "author", e.target.value)
                      }
                      placeholder="~ Client Name"
                      className={inputCls}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addTestimonial}
                className="flex items-center gap-2 text-white hover:text-gray-300 text-xs font-medium mt-1 transition-colors"
              >
                <Plus size={13} /> Add Testimonial
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Live preview mirroring main site */}
        <div className="flex-1 min-w-0 overflow-hidden rounded-2xl border border-[#1e1e1e] bg-black flex flex-col">
          <div className="px-5 py-3 border-b border-[#1e1e1e] shrink-0">
            <span className="text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-widest">
              Live Preview — Clients Section
            </span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center px-8 py-10 gap-10">
            {/* Header */}
            <p className="text-xl md:text-2xl italic font-light tracking-wide text-white font-[Poppins]">
              {data.headerText || "Some of Our Awesome Clients:"}
            </p>

            {/* Logo grid mirroring main site */}
            {data.clients.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="relative group border border-transparent p-4 -m-4 rounded-2xl hover:border-[#1e1e1e] w-full">
                  <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black rounded-full px-2 border border-[#1e1e1e] z-10">
                    <SectionVisibilityToggle
                      sectionId="client-logos"
                      label="Visible"
                    />
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 w-full">
                    <SortableContext
                      items={data.clients}
                      strategy={rectSortingStrategy}
                    >
                      {data.clients.map((client) => (
                        <SortableClientItem key={client.id} client={client} />
                      ))}
                    </SortableContext>
                  </div>
                </div>
              </DndContext>
            )}

            {/* Testimonials mirroring main site */}
            {data.testimonials.length > 0 && (
              <div className="relative group border border-transparent p-4 -m-4 rounded-2xl hover:border-[#1e1e1e] w-full max-w-3xl">
                <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black rounded-full px-2 border border-[#1e1e1e] z-10">
                  <SectionVisibilityToggle
                    sectionId="client-testimonials"
                    label="Visible"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 w-full">
                  {data.testimonials.map((t) => (
                    <div key={t.id} className="flex flex-col">
                      <p className="text-base italic text-white/80 mb-3 font-light leading-relaxed font-[Poppins]">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <p className="text-right text-white/60 font-light text-sm italic tracking-wide">
                        ~ {t.author}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
