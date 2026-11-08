"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, LoaderCircle, Trash2, Upload } from "lucide-react";
import { Card, Modal, PageTitle, api, btnDanger, btnPrimary, btnSecondary } from "@/components/admin/ui";
import { ALLOWED_MIME, MAX_UPLOAD_BYTES, UPLOAD_FOLDERS, UPLOAD_MESSAGES, type UploadFolder } from "@/lib/upload-rules";
import { cn, formatBytes, formatDate } from "@/lib/utils";

type UploadRow = {
  id: string;
  folder: UploadFolder;
  filename: string;
  originalName?: string;
  mimeType: string;
  size: number;
  createdAt: string;
  url: string;
};

export default function AdminUploadsPage() {
  const [folder, setFolder] = useState<UploadFolder | "">("");
  const [items, setItems] = useState<UploadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [target, setTarget] = useState<UploadRow | null>(null);
  const [refs, setRefs] = useState<string[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page) });
      if (folder) qs.set("folder", folder);
      const data = await api<{ items: UploadRow[]; total: number }>(`/api/admin/uploads?${qs}`);
      setItems(data.items);
      setTotal(data.total);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [folder, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function askDelete(row: UploadRow) {
    setTarget(row);
    setRefs(null);
    try {
      const r = await api<{ references: string[] }>(`/api/admin/uploads?refs=${encodeURIComponent(row.url)}`);
      setRefs(r.references);
    } catch {
      setRefs([]);
    }
  }

  async function doDelete() {
    if (!target) return;
    try {
      await api(`/api/admin/uploads?url=${encodeURIComponent(target.url)}`, { method: "DELETE" });
      toast.success(UPLOAD_MESSAGES.removed);
      setTarget(null);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function upload(file?: File) {
    if (!file || uploading) return;
    if (!ALLOWED_MIME[file.type]) return toast.error(UPLOAD_MESSAGES.type);
    if (file.size > MAX_UPLOAD_BYTES) return toast.error(UPLOAD_MESSAGES.size);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder || "misc");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || UPLOAD_MESSAGES.generic);
      toast.success(UPLOAD_MESSAGES.success);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const pages = Math.max(1, Math.ceil(total / 48));

  return (
    <div>
      <PageTitle
        title="Uploads"
        description="All images stored in the database. Images are served from /api/uploads and survive redeployments."
        actions={
          <>
            <input
              ref={inputRef}
              id="library-upload"
              type="file"
              className="sr-only"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={uploading}
              onChange={(e) => upload(e.target.files?.[0])}
            />
            <button type="button" className={btnPrimary} disabled={uploading} onClick={() => inputRef.current?.click()}>
              {uploading ? <LoaderCircle size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? "Uploading..." : `Upload to ${folder || "misc"}`}
            </button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(["", ...UPLOAD_FOLDERS] as const).map((f) => (
          <button
            key={f || "all"}
            type="button"
            onClick={() => {
              setFolder(f);
              setPage(1);
            }}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold capitalize ring-1",
              folder === f ? "bg-navy text-white ring-navy" : "bg-white text-slate-600 ring-slate-200 hover:ring-teal",
            )}
          >
            {f || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <Card className="flex items-center justify-center p-12">
          <LoaderCircle className="animate-spin text-slate-400" />
        </Card>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center text-slate-500">No uploads in this folder yet.</Card>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((u) => (
            <li key={u.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="aspect-square bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.url} alt={u.originalName || u.filename} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="space-y-1 p-3 text-xs">
                <p className="truncate font-semibold text-slate-800" title={u.filename}>
                  {u.originalName || u.filename}
                </p>
                <p className="truncate text-slate-500">{u.filename}</p>
                <p className="text-slate-500">
                  <span className="capitalize">{u.folder}</span> · {u.mimeType.replace("image/", "").toUpperCase()} · {formatBytes(u.size)}
                </p>
                <p className="text-slate-400">{formatDate(u.createdAt)}</p>
                <div className="flex gap-1.5 pt-2">
                  <button
                    type="button"
                    className={btnSecondary + " flex-1 px-2 py-1.5 text-xs"}
                    onClick={() => navigator.clipboard.writeText(u.url).then(() => toast.success("Image URL copied."))}
                  >
                    <Copy size={13} /> URL
                  </button>
                  <button type="button" className={btnDanger + " px-2 py-1.5"} onClick={() => askDelete(u)} aria-label={`Delete ${u.filename}`}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button type="button" className={btnSecondary} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span className="self-center px-2 text-sm text-slate-500">
            Page {page} of {pages}
          </span>
          <button type="button" className={btnSecondary} disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}

      <Modal
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        title="Delete image?"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setTarget(null)}>
              Cancel
            </button>
            <button type="button" className={btnDanger} onClick={doDelete} disabled={refs === null}>
              <Trash2 size={15} /> Delete anyway
            </button>
          </>
        }
      >
        {refs === null ? (
          <p className="flex items-center gap-2 text-slate-500">
            <LoaderCircle size={16} className="animate-spin" /> Checking where this image is used...
          </p>
        ) : refs.length ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">This image is currently used in:</p>
            <ul className="mt-2 list-disc pl-5">
              {refs.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="mt-2">Deleting it will show a placeholder in those places.</p>
          </div>
        ) : (
          <p className="text-slate-600">This image is not used anywhere on the website. It will be permanently deleted.</p>
        )}
      </Modal>
    </div>
  );
}
