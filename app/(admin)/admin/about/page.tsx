"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Save, Plus, Trash2, GripVertical } from "lucide-react";
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { apiGetSection, apiSaveSection } from "@/lib/adminApi";
import type { AboutData, TeamMember, Award } from "@/lib/dataLoader";
import { toast } from "sonner";
import SectionVisibilityToggle from "@/components/admin/SectionVisibilityToggle";
import ImageUpload from "@/components/admin/ImageUpload";

// ─── Shared styles ───────────────────────────────────────────────────────────
const labelCls =
  "text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-wider font-[Inter,sans-serif]";

// ─── FieldEditor ─────────────────────────────────────────────────────────────
function FieldEditor({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const base =
    "w-full bg-transparent border border-[#1e1e1e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-white/50 transition-all font-[Inter,sans-serif]";
  return (
    <div className="space-y-1.5">
      <label className={labelCls}>{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-transparent border border-[#1e1e1e] rounded-3xl overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-[#1e1e1e]">
        <h3 className="text-base font-semibold text-white font-[Poppins,sans-serif]">
          {title}
        </h3>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

// ─── Sortable form card (left panel) ─────────────────────────────────────────
function SortableMemberFormCard({
  member,
  index,
  onUpdate,
  onRemove,
}: {
  member: TeamMember;
  index: number;
  onUpdate: (field: keyof TeamMember, value: string) => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-transparent border border-[#1e1e1e] rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="text-[#555] hover:text-white cursor-grab active:cursor-grabbing transition-colors touch-none select-none"
            title="Drag to reorder"
          >
            <GripVertical size={16} />
          </button>
          <span className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider">
            Member {index + 1}
          </span>
        </div>
        <button
          onClick={onRemove}
          className="text-red-500/80 hover:text-red-500 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-4">
          <FieldEditor
            label="Name"
            value={member.name}
            onChange={(v) => onUpdate("name", v)}
          />
          <FieldEditor
            label="Role"
            value={member.role}
            onChange={(v) => onUpdate("role", v)}
          />
          <div className="col-span-1 sm:col-span-2">
            <ImageUpload
              label="Photo"
              value={member.img}
              onChange={(v) => onUpdate("img", v)}
              folder="images/about/team"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sortable grid card (right preview) ──────────────────────────────────────
function SortableTeamPreviewCard({ member }: { member: TeamMember }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col items-center text-center cursor-grab active:cursor-grabbing select-none touch-none group"
    >
      <div className="w-16 h-16 rounded-full bg-[#d5d5d5] relative overflow-hidden mb-2 ring-2 ring-transparent group-hover:ring-white/30 transition-all">
        {member.img && (
          <Image
            src={member.img}
            alt={member.name}
            fill
            sizes="64px"
            quality={60}
            className="object-cover pointer-events-none"
          />
        )}
      </div>
      <p className="text-white text-xs font-semibold font-[Poppins,sans-serif] leading-tight">
        {member.name || "Name"}
      </p>
      <p className="text-[#8e8e8e] text-[10px] italic font-[Poppins,sans-serif]">
        {member.role || "Role"}
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminAboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGetSection<AboutData>("about")
      .then(setData)
      .catch(() => {});
  }, []);

  // Sensors shared by both DnD contexts
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // ── Team drag handlers ────────────────────────────────────────────────────
  function handleTeamDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setData((prev) => {
        if (!prev) return prev;
        const oldIndex = prev.teamMembers.findIndex((m) => m.id === active.id);
        const newIndex = prev.teamMembers.findIndex((m) => m.id === over.id);
        return {
          ...prev,
          teamMembers: arrayMove(prev.teamMembers, oldIndex, newIndex),
        };
      });
    }
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      await apiSaveSection("about", data);
      toast.success("About section saved!");
    } catch {
      toast.error("Failed to save. Check your admin key.");
    } finally {
      setSaving(false);
    }
  }

  // ── Team helpers ─────────────────────────────────────────────────────────
  function updateMember(idx: number, field: keyof TeamMember, value: string) {
    if (!data) return;
    const members = [...data.teamMembers];
    members[idx] = { ...members[idx], [field]: value };
    setData({ ...data, teamMembers: members });
  }

  function addMember() {
    if (!data) return;
    const newMember: TeamMember = {
      id: String(Date.now()),
      name: "",
      role: "",
      img: "",
      objectPos: "center top",
    };
    setData({ ...data, teamMembers: [...data.teamMembers, newMember] });
  }

  function removeMember(idx: number) {
    if (!data) return;
    setData({
      ...data,
      teamMembers: data.teamMembers.filter((_, i) => i !== idx),
    });
  }

  // ── Award helpers ─────────────────────────────────────────────────────────
  function updateAward(idx: number, field: keyof Award, value: string) {
    if (!data) return;
    const awards = [...data.awards];
    awards[idx] = { ...awards[idx], [field]: value };
    setData({ ...data, awards });
  }

  function addAward() {
    if (!data) return;
    const newAward: Award = {
      id: String(Date.now()),
      name: "",
      description: "",
      year: "",
      icon: "",
    };
    setData({ ...data, awards: [...data.awards, newAward] });
  }

  function removeAward(idx: number) {
    if (!data) return;
    setData({ ...data, awards: data.awards.filter((_, i) => i !== idx) });
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
            About Section
          </h2>
          <p className="text-[#8e8e8e] text-sm mt-1">
            Edit team info, story text, awards, and more.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <SectionVisibilityToggle sectionId="about" />
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
        <div className="w-[420px] shrink-0 overflow-y-auto pr-2">
          {/* Story */}
          <Card title="Our Story">
            <FieldEditor
              label="Title"
              value={data.storyTitle}
              onChange={(v) => setData({ ...data, storyTitle: v })}
            />
            <FieldEditor
              label="Story Text"
              value={data.storyText}
              onChange={(v) => setData({ ...data, storyText: v })}
              multiline
            />
          </Card>

          {/* Purpose */}
          <Card title="Our Purpose">
            <FieldEditor
              label="Title"
              value={data.purposeTitle}
              onChange={(v) => setData({ ...data, purposeTitle: v })}
            />
            <FieldEditor
              label="Purpose Text"
              value={data.purposeText}
              onChange={(v) => setData({ ...data, purposeText: v })}
              multiline
            />
          </Card>

          {/* Brand & Impact */}
          <Card title="Brand & Impact">
            <FieldEditor
              label="Brand Title"
              value={data.brandTitle}
              onChange={(v) => setData({ ...data, brandTitle: v })}
            />
            <FieldEditor
              label="Brand Text"
              value={data.brandText}
              onChange={(v) => setData({ ...data, brandText: v })}
              multiline
            />
            <FieldEditor
              label="Impact Title"
              value={data.impactTitle}
              onChange={(v) => setData({ ...data, impactTitle: v })}
            />
            <FieldEditor
              label="Impact Text"
              value={data.impactText}
              onChange={(v) => setData({ ...data, impactText: v })}
              multiline
            />
          </Card>

          {/* Images */}
          <Card title="Banner Images">
            <div className="space-y-6">
              <div className="w-full">
                <ImageUpload
                  label="Hero Banner Image"
                  value={data.heroBanner}
                  onChange={(v) => setData({ ...data, heroBanner: v })}
                  folder="images/about"
                />
              </div>
              <div className="w-full">
                <ImageUpload
                  label="Brand Image"
                  value={data.brandImage}
                  onChange={(v) => setData({ ...data, brandImage: v })}
                  folder="images/about"
                />
              </div>
              <div className="w-full">
                <ImageUpload
                  label="Impact Image"
                  value={data.impactImage}
                  onChange={(v) => setData({ ...data, impactImage: v })}
                  folder="images/about"
                />
              </div>
            </div>
          </Card>

          {/* ── Team Members (drag-and-drop left panel) ── */}
          <Card title="Team Members">
            <div className="space-y-1 mb-2">
              <p className="text-[10px] text-[#555] font-[Inter,sans-serif]">
                Drag the{" "}
                <GripVertical
                  size={11}
                  className="inline-block text-[#8e8e8e]"
                />{" "}
                handle to reorder members.
              </p>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleTeamDragEnd}
            >
              <SortableContext
                items={data.teamMembers}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {data.teamMembers.map((member, i) => (
                    <SortableMemberFormCard
                      key={member.id}
                      member={member}
                      index={i}
                      onUpdate={(field, value) => updateMember(i, field, value)}
                      onRemove={() => removeMember(i)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <button
              onClick={addMember}
              className="flex items-center gap-2 text-white hover:text-gray-300 text-sm font-medium transition-colors mt-4"
            >
              <Plus size={15} /> Add Team Member
            </button>
          </Card>

          {/* Awards */}
          <Card title="Awards & Recognitions">
            <div className="mb-4 space-y-4">
              <FieldEditor
                label="Section Title"
                value={data.awardsTitle}
                onChange={(v) => setData({ ...data, awardsTitle: v })}
              />
              <FieldEditor
                label="Section Subtitle"
                value={data.awardsSubtitle}
                onChange={(v) => setData({ ...data, awardsSubtitle: v })}
                multiline
              />
            </div>
            <div className="space-y-4">
              {data.awards.map((award, i) => (
                <div
                  key={award.id}
                  className="bg-transparent border border-[#1e1e1e] rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider">
                      Award {i + 1}
                    </span>
                    <button
                      onClick={() => removeAward(i)}
                      className="text-red-500/80 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <FieldEditor
                      label="Name"
                      value={award.name}
                      onChange={(v) => updateAward(i, "name", v)}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FieldEditor
                        label="Description"
                        value={award.description}
                        onChange={(v) => updateAward(i, "description", v)}
                      />
                      <FieldEditor
                        label="Year"
                        value={award.year}
                        onChange={(v) => updateAward(i, "year", v)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addAward}
                className="flex items-center gap-2 text-white hover:text-gray-300 text-sm font-medium transition-colors mt-2"
              >
                <Plus size={15} /> Add Award
              </button>
            </div>
          </Card>
        </div>

        {/* RIGHT: Live Preview */}
        <div className="flex-1 min-w-0 overflow-hidden rounded-2xl border border-[#1e1e1e] bg-black flex flex-col">
          <div className="px-5 py-3 border-b border-[#1e1e1e] shrink-0">
            <span className="text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-widest">
              Live Preview — About Section
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Story */}
            <div className="border border-[#1e1e1e] rounded-2xl p-6 relative group border-t-4 border-t-transparent hover:border-t-[#1e1e1e] transition-all">
              <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black rounded-full px-2 border border-[#1e1e1e] z-10">
                <SectionVisibilityToggle
                  sectionId="about-story"
                  label="Visible"
                />
              </div>
              <h2 className="font-[Poppins,sans-serif] font-bold text-2xl text-white mb-3">
                {data.storyTitle || "Our Story"}
              </h2>
              <p className="font-[Poppins,sans-serif] italic text-sm text-white/70 leading-relaxed">
                {data.storyText || "Story text…"}
              </p>
            </div>

            {/* Purpose */}
            <div className="border border-[#1e1e1e] rounded-2xl p-6 bg-white text-black relative group">
              <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full px-2 border border-black/20 z-10">
                <SectionVisibilityToggle
                  sectionId="about-purpose"
                  label="Visible"
                />
              </div>
              <h2 className="font-[Poppins,sans-serif] font-bold text-2xl mb-3">
                {data.purposeTitle || "Our Purpose"}
              </h2>
              <p className="font-[Poppins,sans-serif] italic text-sm leading-relaxed">
                {data.purposeText || "Purpose text…"}
              </p>
            </div>

            {/* ── Team grid preview (drag-and-drop) ── */}
            {data.teamMembers.length > 0 && (
              <div className="relative group border border-transparent p-4 -m-4 rounded-xl hover:border-[#1e1e1e]">
                <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black rounded-full px-2 border border-[#1e1e1e] z-10">
                  <SectionVisibilityToggle
                    sectionId="about-team"
                    label="Visible"
                  />
                </div>
                <h3 className="text-white font-bold text-sm font-[Poppins,sans-serif] mb-1">
                  {data.teamTitle || "Meet Our Team"} ({data.teamMembers.length}
                  )
                </h3>
                <p className="text-[#555] text-[10px] mb-3 font-[Inter,sans-serif]">
                  Drag cards to reorder
                </p>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleTeamDragEnd}
                >
                  <SortableContext
                    items={data.teamMembers}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-4 gap-3">
                      {data.teamMembers.map((m) => (
                        <SortableTeamPreviewCard key={m.id} member={m} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {/* Awards preview */}
            {data.awards.length > 0 && (
              <div className="relative group border border-transparent p-2 -m-2 rounded-xl hover:border-[#1e1e1e]">
                <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black rounded-full px-2 border border-[#1e1e1e] z-10">
                  <SectionVisibilityToggle
                    sectionId="about-awards"
                    label="Visible"
                  />
                </div>
                <h3 className="text-white font-bold text-sm font-[Poppins,sans-serif] mb-3">
                  {data.awardsTitle || "Awards"}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {data.awards.map((a) => (
                    <div
                      key={a.id}
                      className="border border-[#1e1e1e] rounded-xl px-4 py-3 text-center"
                    >
                      <div className="text-white font-bold text-sm font-[Poppins,sans-serif]">
                        {a.name || "Award"}
                      </div>
                      <div className="text-[#8e8e8e] text-xs italic font-[Inter,sans-serif]">
                        {a.description} {a.year && `| ${a.year}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brand / Impact */}
            <div className="grid grid-cols-2 gap-3 relative group border border-transparent p-2 -m-2 rounded-xl hover:border-[#1e1e1e]">
              <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black rounded-full px-2 border border-[#1e1e1e] z-10">
                <SectionVisibilityToggle
                  sectionId="about-brand-impact"
                  label="Visible"
                />
              </div>
              <div
                className="border border-[#1e1e1e] rounded-xl p-4 relative overflow-hidden"
                style={{ minHeight: 100 }}
              >
                {data.brandImage && (
                  <Image
                    src={data.brandImage}
                    alt="Brand"
                    fill
                    sizes="(max-width: 768px) 100vw, 250px"
                    quality={60}
                    className="object-cover opacity-30"
                  />
                )}
                <div className="relative z-10">
                  <h4 className="text-white font-bold text-sm font-[Poppins,sans-serif]">
                    {data.brandTitle || "Our Brand"}
                  </h4>
                  <p className="text-white/60 text-xs italic font-[Poppins,sans-serif] mt-1 line-clamp-3">
                    {data.brandText}
                  </p>
                </div>
              </div>
              <div
                className="border border-[#1e1e1e] rounded-xl p-4 relative overflow-hidden"
                style={{ minHeight: 100 }}
              >
                {data.impactImage && (
                  <Image
                    src={data.impactImage}
                    alt="Impact"
                    fill
                    sizes="(max-width: 768px) 100vw, 250px"
                    quality={60}
                    className="object-cover opacity-30"
                  />
                )}
                <div className="relative z-10">
                  <h4 className="text-white font-bold text-sm font-[Poppins,sans-serif]">
                    {data.impactTitle || "Our Impact"}
                  </h4>
                  <p className="text-white/60 text-xs italic font-[Poppins,sans-serif] mt-1 line-clamp-3">
                    {data.impactText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
