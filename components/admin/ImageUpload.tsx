"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** ImageKit subfolder relative to /incial-web, e.g. "images/about" or "clients" */
  folder?: string;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  folder,
}: ImageUploadProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [justUploaded, setJustUploaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulated smooth progress bar tick
  const startProgress = () => {
    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressRef.current!);
          return 85;
        }
        return prev + Math.random() * 12;
      });
    }, 180);
  };

  const finishProgress = (success: boolean) => {
    if (progressRef.current) clearInterval(progressRef.current);
    if (success) {
      setProgress(100);
      setJustUploaded(true);
      setTimeout(() => setJustUploaded(false), 2000);
    } else {
      setProgress(0);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      startProgress();

      const formData = new FormData();
      formData.append("file", file);
      if (folder) formData.append("folder", folder);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("admin_token") || ""
          : "";

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to upload image.");
      }

      const data = await res.json();
      finishProgress(true);
      onChange(data.url);
    } catch (err: any) {
      finishProgress(false);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      setError("Please enter a valid URL.");
      return;
    }
    setError(null);
    onChange(urlInput.trim());
    setUrlInput("");
    setMode("upload");
  };

  const clearImage = () => onChange("");

  return (
    <div className="space-y-1.5">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-wider font-[Inter,sans-serif] flex-1 truncate pr-2">
          {label}
        </label>

        {/* Toggle Mode Buttons */}
        <div className="flex items-center bg-[#111] border border-[#1e1e1e] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => {
              setMode("upload");
              setError(null);
            }}
            className={`p-1.5 rounded-md transition-colors flex items-center justify-center ${
              mode === "upload"
                ? "bg-[#222] text-white"
                : "text-[#8e8e8e] hover:text-white"
            }`}
            title="Upload Image"
          >
            <ImageIcon size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("url");
              setError(null);
            }}
            className={`p-1.5 rounded-md transition-colors flex items-center justify-center ${
              mode === "url"
                ? "bg-[#222] text-white"
                : "text-[#8e8e8e] hover:text-white"
            }`}
            title="Image URL"
          >
            <LinkIcon size={14} />
          </button>
        </div>
      </div>

      {/* URL Mode */}
      {mode === "url" ? (
        <div className="flex flex-col gap-2 w-full mt-2">
          <div className="flex items-center gap-2 text-[#8e8e8e] text-xs font-medium ml-1">
            <LinkIcon size={14} />
            <span>Paste Image URL</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://ik.imagekit.io/..."
              className="flex-1 bg-black border border-[#1e1e1e] hover:border-[#333] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/50 transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleUrlSubmit();
                }
              }}
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="bg-white text-black text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors shrink-0"
            >
              Save
            </button>
          </div>
          {value && (
            <div className="text-[11px] text-[#555] ml-1 flex items-center gap-1">
              <span>Current:</span>
              <span className="truncate inline-block max-w-xs" title={value}>
                {value}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`w-full bg-[#0a0a0a] rounded-xl overflow-hidden border transition-all ${
            error
              ? "border-red-500"
              : dragOver
                ? "border-white/40"
                : "border-[#1e1e1e]"
          }`}
        >
          {/* Uploading state */}
          {uploading ? (
            <div className="p-6 flex flex-col items-center justify-center gap-4">
              {/* Animated cloud with bounce */}
              <div className="relative flex items-center justify-center w-14 h-14">
                <div className="absolute inset-0 rounded-full bg-white/5 animate-ping" />
                <div className="relative z-10 rounded-full bg-white/10 p-3">
                  <UploadCloud
                    size={24}
                    className="text-white animate-bounce"
                  />
                </div>
              </div>

              <div className="w-full max-w-[200px] flex flex-col items-center gap-1.5">
                <div className="w-full h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-[#8e8e8e]">
                  Uploading to ImageKit... {Math.round(progress)}%
                </span>
              </div>
            </div>
          ) : justUploaded ? (
            /* Success flash */
            <div className="p-6 flex flex-col items-center justify-center gap-2">
              <CheckCircle2 size={32} className="text-green-400" />
              <span className="text-sm text-green-400 font-medium">
                Upload complete!
              </span>
            </div>
          ) : value ? (
            /* Preview state */
            <div className="relative group p-2">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#1e1e1e] bg-black">
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  quality={60}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                    title="Replace Image"
                  >
                    <UploadCloud size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                    title="Remove Image"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-2 px-1">
                <span
                  className="text-xs text-[#8e8e8e] truncate block"
                  title={value}
                >
                  {value}
                </span>
              </div>
            </div>
          ) : (
            /* Drop zone / idle */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 cursor-pointer group text-center select-none"
            >
              <div
                className={`mb-3 p-3 rounded-full transition-all duration-300 ${
                  dragOver
                    ? "bg-white/15 scale-110"
                    : "bg-white/5 group-hover:bg-white/10 group-hover:scale-105"
                }`}
              >
                <UploadCloud
                  size={26}
                  className={`transition-colors duration-200 ${
                    dragOver
                      ? "text-white"
                      : "text-[#8e8e8e] group-hover:text-white"
                  }`}
                />
              </div>
              <span className="text-sm font-medium text-[#8e8e8e] group-hover:text-white transition-colors">
                {dragOver ? "Drop to upload" : "Click or drag & drop"}
              </span>
              <span className="text-xs text-[#555] mt-1">
                JPG, PNG, GIF, WEBP up to 5MB
              </span>
            </div>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp, image/gif, image/svg+xml"
        className="hidden"
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
