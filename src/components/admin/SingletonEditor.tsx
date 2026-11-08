"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LoaderCircle, Save } from "lucide-react";
import { FieldGrid, setPath, type FieldDef } from "./fields";
import { Card, PageTitle, api, btnPrimary } from "./ui";
import { cn } from "@/lib/utils";

export type Section = { id: string; title: string; description?: string; fields: FieldDef[] };

/** Edits a single content document (site settings, homepage, page heroes) grouped into tabbed sections. */
export function SingletonEditor({
  contentKey,
  title,
  description,
  sections,
}: {
  contentKey: "settings" | "home" | "pages";
  title: string;
  description?: string;
  sections: Section[];
}) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    api<{ data: Record<string, unknown> }>(`/api/admin/content/${contentKey}`)
      .then((r) => setData(r.data))
      .catch((e) => toast.error(e.message));
  }, [contentKey]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    if (!data) return;
    setSaving(true);
    try {
      const r = await api<{ data: Record<string, unknown> }>(`/api/admin/content/${contentKey}`, {
        method: "PUT",
        body: JSON.stringify({ data }),
      });
      setData(r.data);
      setDirty(false);
      toast.success("Changes saved and published.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const section = sections.find((s) => s.id === active) ?? sections[0];

  return (
    <div>
      <PageTitle
        title={title}
        description={description}
        actions={
          <button type="button" className={btnPrimary} onClick={save} disabled={!data || saving || !dirty}>
            {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
            {dirty ? "Save changes" : "Saved"}
          </button>
        }
      />
      {!data ? (
        <Card className="flex items-center justify-center gap-2 p-12 text-slate-500">
          <LoaderCircle className="animate-spin" size={20} /> Loading...
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <nav aria-label="Sections" className="flex gap-2 overflow-x-auto lg:flex-col">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={cn(
                  "shrink-0 rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition",
                  s.id === section.id ? "bg-teal text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-teal",
                )}
              >
                {s.title}
              </button>
            ))}
          </nav>
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
            {section.description && <p className="mt-1 mb-5 text-sm text-slate-500">{section.description}</p>}
            <div className={cn(!section.description && "mt-5")}>
              <FieldGrid
                fields={section.fields}
                values={data}
                idPrefix={contentKey}
                onChange={(path, v) => {
                  setData((d) => (d ? setPath(d, path, v) : d));
                  setDirty(true);
                }}
              />
            </div>
            <div className="mt-8 flex justify-end border-t border-slate-100 pt-5">
              <button type="button" className={btnPrimary} onClick={save} disabled={saving || !dirty}>
                {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />} Save changes
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
