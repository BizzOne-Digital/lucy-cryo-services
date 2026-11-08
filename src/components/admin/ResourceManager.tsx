"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ExternalLink, LoaderCircle, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { FieldGrid, setPath, type FieldDef } from "./fields";
import { Badge, Card, Modal, PageTitle, api, btnDanger, btnPrimary, btnSecondary, inputCls } from "./ui";
import { resolveImageUrl } from "@/lib/images";

type Item = Record<string, unknown> & { _id: string };

export type ResourceConfig = {
  resource: "services" | "blogs" | "promotions" | "gallery";
  title: string;
  singular: string;
  description?: string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  listTitle: string;
  listSubtitle?: string;
  listImage?: string;
  badges?: { field: string; on: string; off: string }[];
  orderable?: boolean;
  publicUrl?: (item: Item) => string | null;
};

/** Generic list + create/edit/delete manager used for services, blogs, promotions and gallery. */
export function ResourceManager(cfg: ResourceConfig) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Item | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<{ items: Item[] }>(`/api/admin/${cfg.resource}?limit=100`);
      setItems(data.items);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [cfg.resource]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((i) => String(i[cfg.listTitle] ?? "").toLowerCase().includes(t));
  }, [items, q, cfg.listTitle]);

  function openNew() {
    const nextOrder = items.reduce((m, i) => Math.max(m, Number(i.order) || 0), 0) + 1;
    setEditing({ ...cfg.defaults, ...(cfg.orderable ? { order: nextOrder } : {}) });
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const isNew = !editing._id;
      const { _id, createdAt, updatedAt, __v, ...body } = editing as Item & { createdAt?: string; updatedAt?: string; __v?: number };
      void createdAt;
      void updatedAt;
      void __v;
      await api(isNew ? `/api/admin/${cfg.resource}` : `/api/admin/${cfg.resource}/${_id}`, {
        method: isNew ? "POST" : "PATCH",
        body: JSON.stringify(body),
      });
      toast.success(`${cfg.singular} ${isNew ? "created" : "saved"}.`);
      setEditing(null);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: Item) {
    try {
      await api(`/api/admin/${cfg.resource}/${item._id}`, { method: "DELETE" });
      toast.success(`${cfg.singular} deleted.`);
      setConfirmDelete(null);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function patch(item: Item, changes: Record<string, unknown>) {
    const { _id, createdAt, updatedAt, __v, ...rest } = item as Item & { createdAt?: string; updatedAt?: string; __v?: number };
    void createdAt;
    void updatedAt;
    void __v;
    await api(`/api/admin/${cfg.resource}/${_id}`, { method: "PATCH", body: JSON.stringify({ ...rest, ...changes }) });
  }

  async function move(index: number, dir: -1 | 1) {
    const a = items[index];
    const b = items[index + dir];
    if (!a || !b) return;
    try {
      // Normalise to sequential order values, then swap the pair.
      const orderA = index + 1;
      const orderB = index + dir + 1;
      await Promise.all([patch(a, { order: orderB }), patch(b, { order: orderA })]);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function toggle(item: Item, field: string) {
    try {
      await patch(item, { [field]: !item[field] });
      setItems((list) => list.map((i) => (i._id === item._id ? { ...i, [field]: !item[field] } : i)));
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div>
      <PageTitle
        title={cfg.title}
        description={cfg.description}
        actions={
          <button type="button" className={btnPrimary} onClick={openNew}>
            <Plus size={16} /> Add {cfg.singular}
          </button>
        }
      />

      <Card>
        <div className="border-b border-slate-200 p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              aria-label={`Search ${cfg.title}`}
              placeholder={`Search ${cfg.title.toLowerCase()}...`}
              className={`${inputCls} pl-9`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-slate-500">
            <LoaderCircle className="animate-spin" size={20} /> Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No {cfg.title.toLowerCase()} yet.{" "}
            <button type="button" className="font-semibold text-teal" onClick={openNew}>
              Add the first one
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((item) => {
              const index = items.findIndex((i) => i._id === item._id);
              const img = cfg.listImage ? (item[cfg.listImage] as string) : "";
              const href = cfg.publicUrl?.(item);
              return (
                <li key={item._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    {cfg.listImage && (
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image src={resolveImageUrl(img)} alt="" fill sizes="80px" className="object-cover" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{String(item[cfg.listTitle] || "Untitled")}</p>
                      {cfg.listSubtitle && <p className="truncate text-sm text-slate-500">{String(item[cfg.listSubtitle] || "")}</p>}
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {cfg.badges?.map((b) => (
                          <button
                            key={b.field}
                            type="button"
                            onClick={() => toggle(item, b.field)}
                            title={`Click to toggle ${b.field}`}
                          >
                            <Badge color={item[b.field] ? "green" : "slate"}>{item[b.field] ? b.on : b.off}</Badge>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {cfg.orderable && !q && (
                      <>
                        <button type="button" className={btnSecondary + " px-2.5"} disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move up">
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          className={btnSecondary + " px-2.5"}
                          disabled={index === items.length - 1}
                          onClick={() => move(index, 1)}
                          aria-label="Move down"
                        >
                          <ArrowDown size={15} />
                        </button>
                      </>
                    )}
                    {href && (
                      <a href={href} target="_blank" rel="noreferrer" className={btnSecondary + " px-2.5"} aria-label="View on website">
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <button type="button" className={btnSecondary} onClick={() => setEditing({ ...item })}>
                      <Pencil size={15} /> Edit
                    </button>
                    <button type="button" className={btnDanger + " px-2.5"} onClick={() => setConfirmDelete(item)} aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Modal
        open={Boolean(editing)}
        onClose={() => !saving && setEditing(null)}
        title={editing?._id ? `Edit ${cfg.singular}` : `New ${cfg.singular}`}
        wide
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setEditing(null)} disabled={saving}>
              Cancel
            </button>
            <button type="button" className={btnPrimary} onClick={save} disabled={saving}>
              {saving && <LoaderCircle size={16} className="animate-spin" />} Save {cfg.singular}
            </button>
          </>
        }
      >
        {editing && (
          <FieldGrid
            fields={cfg.fields}
            values={editing}
            idPrefix={cfg.resource}
            onChange={(path, v) => setEditing((e) => (e ? setPath(e, path, v) : e))}
          />
        )}
      </Modal>

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title={`Delete ${cfg.singular.toLowerCase()}?`}
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setConfirmDelete(null)}>
              Cancel
            </button>
            <button type="button" className={btnPrimary.replace("bg-teal", "bg-red-600").replace("hover:bg-navy", "hover:bg-red-700")} onClick={() => confirmDelete && remove(confirmDelete)}>
              <Trash2 size={15} /> Delete
            </button>
          </>
        }
      >
        <p className="text-slate-600">
          <strong>{String(confirmDelete?.[cfg.listTitle] || "This item")}</strong> will be permanently deleted. Its uploaded image is also
          removed if nothing else uses it. This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
