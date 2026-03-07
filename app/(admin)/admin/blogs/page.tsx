"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Save, Plus, Trash2, Star } from "lucide-react";
import { apiGetSection, apiSaveSection } from "@/lib/adminApi";
import type { BlogsData, BlogPost } from "@/lib/dataLoader";
import { toast } from "sonner";
import SectionVisibilityToggle from "@/components/admin/SectionVisibilityToggle";
import ImageUpload from "@/components/admin/ImageUpload";
const inputCls =
  "w-full bg-transparent border border-[#1e1e1e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#555] focus:outline-none focus:border-white/50 transition-all font-[Inter,sans-serif]";
const labelCls =
  "text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-wider font-[Inter,sans-serif]";

function PostCard({
  post,
  index,
  category,
  onChange,
  onRemove,
}: {
  post: BlogPost;
  index: number;
  category: string;
  onChange: (field: keyof BlogPost, value: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border border-[#1e1e1e] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {category === "popular" && (
            <Star size={12} className="text-white fill-white" />
          )}
          <span className={labelCls}>
            {category === "popular" ? "Popular" : "Newest"} · Post {index + 1}
          </span>
        </div>
        <button
          onClick={onRemove}
          className="text-red-500/70 hover:text-red-500"
        >
          <Trash2 size={13} />
        </button>
      </div>
      <div className="space-y-1.5">
        <label className={labelCls}>Title</label>
        <input
          type="text"
          value={post.title}
          onChange={(e) => onChange("title", e.target.value)}
          className={inputCls}
          placeholder="Blog post title..."
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1.5">
          <label className={labelCls}>Author</label>
          <input
            type="text"
            value={post.author}
            onChange={(e) => onChange("author", e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>Mins</label>
          <input
            type="number"
            value={post.mins}
            onChange={(e) => onChange("mins", e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>Date</label>
          <input
            type="text"
            value={post.date}
            onChange={(e) => onChange("date", e.target.value)}
            className={inputCls}
            placeholder="Dec 01, 2025"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label className={labelCls}>Slug</label>
          <input
            type="text"
            value={post.slug}
            onChange={(e) => onChange("slug", e.target.value)}
            className={inputCls}
            placeholder="my-post"
          />
        </div>
        <div className="space-y-1.5">
          <ImageUpload
            label="Image"
            value={post.image}
            onChange={(v) => onChange("image", v)}
            folder="images/blogs"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className={labelCls}>Content</label>
        <textarea
          value={post.content || ""}
          onChange={(e) => onChange("content", e.target.value)}
          className={`${inputCls} min-h-[100px] resize-y`}
          placeholder="Main content of the blog post. Supports paragraphs separated by empty lines."
        />
      </div>
    </div>
  );
}

function BlogPreviewCard({
  post,
  featured = false,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  return (
    <div
      className={`border border-[#1e1e1e] rounded-xl overflow-hidden bg-[#0a0a0a] ${featured ? "col-span-2" : ""}`}
    >
      <div
        className={`relative bg-[#1a1a1a] ${featured ? "h-40" : "h-28"} overflow-hidden`}
      >
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
            <span className="text-[#555] text-xs">No image</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-white text-sm font-semibold font-[Poppins,sans-serif] line-clamp-2 mb-1">
          {post.title || "Blog post title"}
        </p>
        <p className="text-[#8e8e8e] text-xs font-[Inter,sans-serif]">
          {post.author || "Author"} · {post.mins} min · {post.date}
        </p>
      </div>
    </div>
  );
}

export default function AdminBlogsPage() {
  const [data, setData] = useState<BlogsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"popular" | "newest">("popular");

  useEffect(() => {
    apiGetSection<BlogsData>("blogs")
      .then(setData)
      .catch(() => {});
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      await apiSaveSection("blogs", data);
      toast.success("Blog posts saved!");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  function updatePopular(idx: number, field: keyof BlogPost, value: string) {
    if (!data) return;
    const posts = [...data.popularPosts];
    posts[idx] = {
      ...posts[idx],
      [field]: field === "mins" || field === "id" ? Number(value) : value,
    } as BlogPost;
    setData({ ...data, popularPosts: posts });
  }

  function updateNewest(idx: number, field: keyof BlogPost, value: string) {
    if (!data) return;
    const posts = [...data.newestPosts];
    posts[idx] = {
      ...posts[idx],
      [field]: field === "mins" || field === "id" ? Number(value) : value,
    } as BlogPost;
    setData({ ...data, newestPosts: posts });
  }

  function addPost(category: "popular" | "newest") {
    if (!data) return;
    const newPost: BlogPost = {
      id: Date.now(),
      slug: `${category}-${Date.now()}`,
      title: "",
      author: "",
      mins: 5,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }),
      image: "https://ik.imagekit.io/0bs3my2iz/incial-web/images/case1.webp",
      category,
      content: "",
    };
    if (category === "popular")
      setData({ ...data, popularPosts: [...data.popularPosts, newPost] });
    else setData({ ...data, newestPosts: [...data.newestPosts, newPost] });
  }

  if (!data)
    return (
      <div className="flex items-center justify-center h-40 text-white/40">
        <Loader2 size={20} className="animate-spin mr-2" /> Loading…
      </div>
    );

  const activePosts =
    activeTab === "popular" ? data.popularPosts : data.newestPosts;
  const updateFn = activeTab === "popular" ? updatePopular : updateNewest;

  return (
    <div className="flex flex-col h-full gap-0 font-[Inter,sans-serif]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white font-[Poppins,sans-serif]">
            Blog Posts
          </h2>
          <p className="text-[#8e8e8e] text-sm mt-1">
            {data.popularPosts.length} popular · {data.newestPosts.length}{" "}
            newest
          </p>
        </div>
        <div className="flex items-center gap-6">
          <SectionVisibilityToggle sectionId="blogs" />
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
        <div className="w-[420px] shrink-0 overflow-y-auto pr-2 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {(["popular", "newest"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-colors capitalize ${
                  activeTab === tab
                    ? "bg-white text-black"
                    : "border border-[#1e1e1e] text-[#8e8e8e] hover:text-white"
                }`}
              >
                {tab === "popular" && (
                  <Star
                    size={12}
                    className={activeTab === tab ? "fill-black" : ""}
                  />
                )}
                {tab} Posts
              </button>
            ))}
          </div>

          {/* Posts list */}
          <div className="space-y-3">
            {activePosts.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                index={i}
                category={activeTab}
                onChange={(field, value) => updateFn(i, field, value)}
                onRemove={() => {
                  if (activeTab === "popular")
                    setData({
                      ...data,
                      popularPosts: data.popularPosts.filter((_, j) => j !== i),
                    });
                  else
                    setData({
                      ...data,
                      newestPosts: data.newestPosts.filter((_, j) => j !== i),
                    });
                }}
              />
            ))}
            <button
              onClick={() => addPost(activeTab)}
              className="flex items-center gap-2 text-white hover:text-gray-300 text-xs font-medium mt-1 transition-colors"
            >
              <Plus size={13} /> Add{" "}
              {activeTab === "popular" ? "Popular" : "Newest"} Post
            </button>
          </div>
        </div>

        {/* RIGHT: Live preview */}
        <div className="flex-1 min-w-0 overflow-hidden rounded-2xl border border-[#1e1e1e] bg-black flex flex-col">
          <div className="px-5 py-3 border-b border-[#1e1e1e] flex items-center justify-between shrink-0">
            <span className="text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-widest">
              Live Preview — Blog Section
            </span>
            <div className="flex gap-2 text-[10px] text-[#8e8e8e]">
              <Star size={10} className="inline fill-white text-white" />{" "}
              {data.popularPosts.length} popular &nbsp;·&nbsp;{" "}
              {data.newestPosts.length} newest
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Popular Posts */}
            {data.popularPosts.length > 0 && (
              <div className="relative group border border-transparent p-2 -m-2 rounded-xl hover:border-[#1e1e1e]">
                <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black rounded-full px-2 border border-[#1e1e1e] z-10">
                  <SectionVisibilityToggle
                    sectionId="blog-popular"
                    label="Visible"
                  />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Star size={14} className="text-white fill-white" />
                  <span className="text-sm font-semibold text-white font-[Poppins,sans-serif]">
                    Popular Posts
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {data.popularPosts.map((post, i) => (
                    <BlogPreviewCard
                      key={post.id}
                      post={post}
                      featured={i === 0}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Newest Posts */}
            {data.newestPosts.length > 0 && (
              <div className="relative group border border-transparent p-2 -m-2 rounded-xl hover:border-[#1e1e1e]">
                <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black rounded-full px-2 border border-[#1e1e1e] z-10">
                  <SectionVisibilityToggle
                    sectionId="blog-newest"
                    label="Visible"
                  />
                </div>
                <div className="mb-4">
                  <span className="text-sm font-semibold text-white font-[Poppins,sans-serif]">
                    Newest Posts
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {data.newestPosts.map((post) => (
                    <BlogPreviewCard key={post.id} post={post} />
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
