"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, LoaderCircle, Mail, Phone, Search, Trash2 } from "lucide-react";
import { Badge, Card, Modal, PageTitle, STATUS_COLORS, api, btnDanger, btnPrimary, btnSecondary, inputCls, labelCls } from "./ui";
import { cn, formatDate, telHref } from "@/lib/utils";

type Row = Record<string, string> & { _id: string };

const TABS = {
  bookings: { label: "Bookings", statuses: ["pending", "confirmed", "completed", "cancelled"] },
  inquiries: { label: "Enquiries", statuses: ["new", "replied", "closed"] },
} as const;
type Tab = keyof typeof TABS;

export function SubmissionsManager() {
  const router = useRouter();
  const params = useSearchParams();
  const tab: Tab = params.get("tab") === "inquiries" ? "inquiries" : "bookings";
  const status = params.get("status") || "";

  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Row | null>(null);
  const [notes, setNotes] = useState("");
  const [nextStatus, setNextStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const limit = 25;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) qs.set("q", search);
      if (status) qs.set("status", status);
      const data = await api<{ items: Row[]; total: number }>(`/api/admin/${tab}?${qs}`);
      setRows(data.items);
      setTotal(data.total);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [tab, status, search, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(q.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  function setFilter(next: { tab?: Tab; status?: string }) {
    const sp = new URLSearchParams();
    const t = next.tab ?? tab;
    if (t === "inquiries") sp.set("tab", "inquiries");
    const st = next.tab && next.tab !== tab ? "" : next.status ?? status;
    if (st) sp.set("status", st);
    setPage(1);
    router.replace(`/admin/bookings${sp.size ? `?${sp}` : ""}`);
  }

  function open(row: Row) {
    setSelected(row);
    setNotes(row.adminNotes || "");
    setNextStatus(row.status);
  }

  async function saveSelected() {
    if (!selected) return;
    setSaving(true);
    try {
      await api(`/api/admin/${tab}/${selected._id}`, { method: "PATCH", body: JSON.stringify({ status: nextStatus, adminNotes: notes }) });
      toast.success("Updated.");
      setSelected(null);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function quickStatus(row: Row, s: string) {
    try {
      await api(`/api/admin/${tab}/${row._id}`, { method: "PATCH", body: JSON.stringify({ status: s }) });
      setRows((r) => r.map((x) => (x._id === row._id ? { ...x, status: s } : x)));
      toast.success(`Status changed to ${s}.`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function remove() {
    if (!selected) return;
    try {
      await api(`/api/admin/${tab}/${selected._id}`, { method: "DELETE" });
      toast.success("Deleted.");
      setConfirmDelete(false);
      setSelected(null);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  const statuses = TABS[tab].statuses as readonly string[];
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <PageTitle title="Bookings & Enquiries" description="Review requests, update their status and keep internal notes." />

      <div className="mb-4 flex gap-2">
        {(Object.keys(TABS) as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter({ tab: t })}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold",
              t === tab ? "bg-teal text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-teal",
            )}
          >
            {TABS[t].label}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center">
          <div className="relative flex-1 md:max-w-sm">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" aria-hidden />
            <input aria-label="Search" placeholder="Search name, email, phone..." className={`${inputCls} pl-9`} value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["", ...statuses].map((s) => (
              <button
                key={s || "all"}
                type="button"
                onClick={() => setFilter({ status: s })}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1",
                  status === s ? "bg-navy text-white ring-navy" : "bg-white text-slate-600 ring-slate-200 hover:ring-teal",
                )}
              >
                {s || "All"}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                {tab === "bookings" ? (
                  <>
                    <th className="px-4 py-3 font-semibold">Service</th>
                    <th className="px-4 py-3 font-semibold">Preferred</th>
                  </>
                ) : (
                  <th className="px-4 py-3 font-semibold">Message</th>
                )}
                <th className="px-4 py-3 font-semibold">Received</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-500">
                    <LoaderCircle className="mx-auto animate-spin" />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-500">
                    Nothing found.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{r.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <div className="max-w-[200px] truncate">{r.email}</div>
                      <div className="text-xs text-slate-400">{r.phone}</div>
                    </td>
                    {tab === "bookings" ? (
                      <>
                        <td className="px-4 py-3 text-slate-600">{r.serviceName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                          {formatDate(r.preferredDate, { month: "short", day: "numeric", year: "numeric" })}
                          <div className="text-xs text-slate-400">{r.preferredTime}</div>
                        </td>
                      </>
                    ) : (
                      <td className="max-w-xs px-4 py-3 text-slate-600">
                        <p className="line-clamp-2">{r.message}</p>
                      </td>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatDate(r.createdAt, { month: "short", day: "numeric" })}</td>
                    <td className="px-4 py-3">
                      <select
                        aria-label={`Status for ${r.name}`}
                        value={r.status}
                        onChange={(e) => quickStatus(r, e.target.value)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold capitalize"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" className={btnSecondary + " px-3 py-1.5"} onClick={() => open(r)}>
                        <Eye size={15} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 p-4 text-sm text-slate-500">
            <span>
              {total} total · page {page} of {pages}
            </span>
            <div className="flex gap-2">
              <button type="button" className={btnSecondary} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <button type="button" className={btnSecondary} disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      <Modal
        open={Boolean(selected)}
        onClose={() => !saving && setSelected(null)}
        title={tab === "bookings" ? "Booking details" : "Enquiry details"}
        footer={
          <>
            <button type="button" className={btnDanger + " mr-auto"} onClick={() => setConfirmDelete(true)}>
              <Trash2 size={15} /> Delete
            </button>
            <button type="button" className={btnSecondary} onClick={() => setSelected(null)} disabled={saving}>
              Close
            </button>
            <button type="button" className={btnPrimary} onClick={saveSelected} disabled={saving}>
              {saving && <LoaderCircle size={16} className="animate-spin" />} Save
            </button>
          </>
        }
      >
        {selected && (
          <div className="space-y-5 text-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-slate-900">{selected.name}</p>
                <p className="text-slate-500">Received {formatDate(selected.createdAt)}</p>
              </div>
              <Badge color={STATUS_COLORS[selected.status]}>{selected.status}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={`mailto:${selected.email}`} className={btnSecondary}>
                <Mail size={15} /> {selected.email}
              </a>
              {selected.phone && (
                <a href={telHref(selected.phone)} className={btnSecondary}>
                  <Phone size={15} /> {selected.phone}
                </a>
              )}
            </div>
            {tab === "bookings" && (
              <dl className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
                <div>
                  <dt className="text-xs text-slate-500 uppercase">Service</dt>
                  <dd className="font-semibold text-slate-900">{selected.serviceName}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 uppercase">Preferred</dt>
                  <dd className="font-semibold text-slate-900">
                    {formatDate(selected.preferredDate)} · {selected.preferredTime}
                  </dd>
                </div>
                {selected.source && (
                  <div className="col-span-2">
                    <dt className="text-xs text-slate-500 uppercase">Heard about us via</dt>
                    <dd className="font-semibold text-slate-900">{selected.source}</dd>
                  </div>
                )}
              </dl>
            )}
            {selected.message && (
              <div>
                <p className={labelCls}>{tab === "bookings" ? "Treatment goals / message" : "Message"}</p>
                <p className="rounded-lg bg-slate-50 p-4 whitespace-pre-line text-slate-700">{selected.message}</p>
              </div>
            )}
            <div>
              <label htmlFor="status" className={labelCls}>
                Status
              </label>
              <select id="status" className={inputCls + " capitalize"} value={nextStatus} onChange={(e) => setNextStatus(e.target.value)}>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="notes" className={labelCls}>
                Internal notes
              </label>
              <textarea id="notes" rows={4} className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Only visible to admins." />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete permanently?"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setConfirmDelete(false)}>
              Cancel
            </button>
            <button type="button" className={btnDanger} onClick={remove}>
              <Trash2 size={15} /> Delete
            </button>
          </>
        }
      >
        <p className="text-slate-600">This record will be permanently deleted. This cannot be undone.</p>
      </Modal>
    </div>
  );
}
