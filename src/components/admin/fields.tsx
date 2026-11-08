"use client";

import { Plus, Trash2 } from "lucide-react";
import { AdminImageUpload } from "./AdminImageUpload";
import { Toggle, inputCls, labelCls } from "./ui";
import type { UploadFolder } from "@/lib/upload-rules";
import { cn, slugify } from "@/lib/utils";

export type FieldDef = {
  name: string; // supports dotted paths, e.g. "hero.heading"
  label: string;
  type: "text" | "textarea" | "number" | "boolean" | "image" | "list" | "select" | "slug" | "date" | "url" | "email";
  help?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  folder?: UploadFolder;
  rows?: number;
  full?: boolean;
  slugFrom?: string;
  maxLength?: number;
};

type AnyObj = Record<string, unknown>;

export function getPath(obj: AnyObj, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as AnyObj)[k] : undefined), obj);
}

export function setPath<T extends AnyObj>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const clone: AnyObj = Array.isArray(obj) ? ([...obj] as unknown as AnyObj) : { ...obj };
  let cur: AnyObj = clone;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      cur[k] = value;
    } else {
      const next = cur[k];
      cur[k] = Array.isArray(next) ? [...next] : { ...((next as AnyObj) || {}) };
      cur = cur[k] as AnyObj;
    }
  });
  return clone as T;
}

export function FieldInput({
  field,
  value,
  onChange,
  values,
  idPrefix = "f",
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  values: AnyObj;
  idPrefix?: string;
}) {
  const id = `${idPrefix}-${field.name.replace(/\./g, "-")}`;
  const label = (
    <label htmlFor={id} className={labelCls}>
      {field.label}
      {field.required && <span className="text-red-600"> *</span>}
    </label>
  );
  const help = field.help && <p className="mt-1 text-xs text-slate-500">{field.help}</p>;

  switch (field.type) {
    case "boolean":
      return (
        <div className="flex items-center pt-6">
          <Toggle id={id} label={field.label} checked={Boolean(value)} onChange={onChange} />
        </div>
      );
    case "image":
      return (
        <div>
          <AdminImageUpload id={id} label={field.label} folder={field.folder || "pages"} value={(value as string) || ""} onChange={onChange} />
          {help}
        </div>
      );
    case "textarea":
      return (
        <div>
          {label}
          <textarea
            id={id}
            rows={field.rows || 4}
            maxLength={field.maxLength}
            className={cn(inputCls, "resize-y")}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </div>
      );
    case "select":
      return (
        <div>
          {label}
          <select id={id} className={inputCls} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {help}
        </div>
      );
    case "number":
      return (
        <div>
          {label}
          <input id={id} type="number" min={0} className={inputCls} value={(value as number) ?? 0} onChange={(e) => onChange(Number(e.target.value))} />
          {help}
        </div>
      );
    case "date":
      return (
        <div>
          {label}
          <input
            id={id}
            type="date"
            className={inputCls}
            value={value ? String(value).slice(0, 10) : ""}
            onChange={(e) => onChange(e.target.value ? new Date(`${e.target.value}T12:00:00Z`).toISOString() : null)}
          />
          {help}
        </div>
      );
    case "slug":
      return (
        <div>
          {label}
          <div className="flex gap-2">
            <input id={id} className={inputCls} value={(value as string) ?? ""} onChange={(e) => onChange(slugify(e.target.value))} />
            {field.slugFrom && (
              <button
                type="button"
                className="shrink-0 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-600 hover:border-teal hover:text-teal"
                onClick={() => onChange(slugify(String(getPath(values, field.slugFrom!) || "")))}
              >
                Generate
              </button>
            )}
          </div>
          {help || <p className="mt-1 text-xs text-slate-500">Lowercase letters, numbers and hyphens. Changing it changes the page URL.</p>}
        </div>
      );
    case "list": {
      const list = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div>
          <span className={labelCls}>{field.label}</span>
          <ul className="space-y-2">
            {list.map((item, i) => (
              <li key={i} className="flex gap-2">
                <input
                  aria-label={`${field.label} ${i + 1}`}
                  className={inputCls}
                  value={item}
                  onChange={(e) => onChange(list.map((v, j) => (j === i ? e.target.value : v)))}
                />
                <button
                  type="button"
                  aria-label={`Remove ${field.label} ${i + 1}`}
                  className="rounded-lg border border-slate-300 px-2.5 text-slate-500 hover:border-red-300 hover:text-red-600"
                  onClick={() => onChange(list.filter((_, j) => j !== i))}
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-navy"
            onClick={() => onChange([...list, ""])}
          >
            <Plus size={15} /> Add item
          </button>
          {help}
        </div>
      );
    }
    default:
      return (
        <div>
          {label}
          <input
            id={id}
            type={field.type === "email" ? "email" : "text"}
            maxLength={field.maxLength}
            className={inputCls}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </div>
      );
  }
}

export function FieldGrid({
  fields,
  values,
  onChange,
  idPrefix,
}: {
  fields: FieldDef[];
  values: AnyObj;
  onChange: (path: string, v: unknown) => void;
  idPrefix?: string;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={cn((f.full || ["textarea", "list", "image"].includes(f.type)) && "sm:col-span-2")}>
          <FieldInput field={f} value={getPath(values, f.name)} values={values} onChange={(v) => onChange(f.name, v)} idPrefix={idPrefix} />
        </div>
      ))}
    </div>
  );
}
