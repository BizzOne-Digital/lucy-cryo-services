"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, LoaderCircle, RefreshCw, Trash2 } from "lucide-react";
import { ALLOWED_MIME, MAX_UPLOAD_BYTES, UPLOAD_MESSAGES, type UploadFolder } from "@/lib/upload-rules";
import { resolveImageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

type Props = {
  value?: string;
  folder: UploadFolder;
  onChange: (url: string) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
  aspect?: "video" | "square" | "wide";
};

/**
 * Reusable admin image field.
 * Uploads to /api/upload (stored in MongoDB) and only calls onChange with the new URL after the server succeeds.
 * Old images are cleaned up by the API after the parent document is saved — never before.
 */
export function AdminImageUpload({ value, folder, onChange, label = "Image", id, disabled, aspect = "video" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const inputId = id || `img-${folder}-${label.replace(/\W+/g, "-").toLowerCase()}`;

  async function handleFile(file?: File) {
    if (!file || uploading) return;
    if (!ALLOWED_MIME[file.type]) return toast.error(UPLOAD_MESSAGES.type);
    if (file.size > MAX_UPLOAD_BYTES) return toast.error(UPLOAD_MESSAGES.size);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.message || UPLOAD_MESSAGES.generic);
      onChange(data.url);
      toast.success(UPLOAD_MESSAGES.success);
    } catch (err) {
      toast.error((err as Error).message || UPLOAD_MESSAGES.generic);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const busy = uploading || disabled;
  const ratio = aspect === "square" ? "aspect-square" : aspect === "wide" ? "aspect-[3/1]" : "aspect-video";

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border-2 border-dashed bg-slate-50 transition",
          ratio,
          busy ? "border-slate-200" : "border-slate-300 hover:border-teal",
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!busy) handleFile(e.dataTransfer.files?.[0]);
        }}
      >
        {value ? (
          <Image
            src={resolveImageUrl(value)}
            alt={`${label} preview`}
            fill
            sizes="400px"
            className="object-cover"
            unoptimized={value.startsWith("/api/uploads/")}
          />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500 hover:text-teal disabled:cursor-not-allowed"
          >
            <ImagePlus size={30} strokeWidth={1.4} aria-hidden />
            <span className="text-sm font-medium">Click or drop an image</span>
            <span className="text-xs">JPEG, PNG, WEBP or GIF · max 8MB</span>
          </button>
        )}
        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 text-teal" role="status">
            <LoaderCircle size={28} className="animate-spin" aria-hidden />
            <span className="text-sm font-semibold">Uploading...</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        disabled={busy}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value && (
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-teal hover:text-teal disabled:opacity-50"
          >
            <RefreshCw size={14} aria-hidden /> Replace
          </button>
          <button
            type="button"
            onClick={() => {
              onChange("");
              toast.success("Image removed. Save to apply the change.");
            }}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={14} aria-hidden /> Remove
          </button>
        </div>
      )}
    </div>
  );
}
