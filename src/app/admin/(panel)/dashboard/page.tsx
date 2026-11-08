import Link from "next/link";
import { AlertTriangle, CalendarCheck, Clock, FileText, Inbox, Sparkles, Tag } from "lucide-react";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { formatDate } from "@/lib/utils";
import Booking from "@/models/Booking";
import ContactInquiry from "@/models/ContactInquiry";
import Service from "@/models/Service";
import BlogPost from "@/models/BlogPost";
import Promotion from "@/models/Promotion";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  confirmed: "bg-sky-50 text-sky-700 ring-sky-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  new: "bg-amber-50 text-amber-800 ring-amber-200",
  replied: "bg-sky-50 text-sky-700 ring-sky-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
};

async function loadStats() {
  await connectDB();
  const [totalBookings, pendingBookings, totalInquiries, newInquiries, services, publishedBlogs, activePromos, recentBookings, recentInquiries] =
    await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      ContactInquiry.countDocuments(),
      ContactInquiry.countDocuments({ status: "new" }),
      Service.countDocuments(),
      BlogPost.countDocuments({ published: true }),
      Promotion.countDocuments({ active: true }),
      Booking.find().sort({ createdAt: -1 }).limit(6).lean(),
      ContactInquiry.find().sort({ createdAt: -1 }).limit(6).lean(),
    ]);
  return { totalBookings, pendingBookings, totalInquiries, newInquiries, services, publishedBlogs, activePromos, recentBookings, recentInquiries };
}

export default async function DashboardPage() {
  if (!isDbConfigured()) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="flex items-center gap-2 font-bold">
          <AlertTriangle size={18} /> Database not configured
        </p>
        <p className="mt-2 text-sm">Add MONGODB_URI to your environment variables to enable the admin panel.</p>
      </div>
    );
  }

  let s: Awaited<ReturnType<typeof loadStats>>;
  try {
    s = await loadStats();
  } catch {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        Unable to reach the database right now. Please refresh in a moment.
      </div>
    );
  }

  const cards = [
    { label: "Total bookings", value: s.totalBookings, Icon: CalendarCheck, href: "/admin/bookings" },
    { label: "Pending bookings", value: s.pendingBookings, Icon: Clock, href: "/admin/bookings?status=pending", warn: s.pendingBookings > 0 },
    { label: "Total enquiries", value: s.totalInquiries, Icon: Inbox, href: "/admin/bookings?tab=inquiries", sub: `${s.newInquiries} new` },
    { label: "Services", value: s.services, Icon: Sparkles, href: "/admin/services" },
    { label: "Published blogs", value: s.publishedBlogs, Icon: FileText, href: "/admin/blogs" },
    { label: "Active promotions", value: s.activePromos, Icon: Tag, href: "/admin/promotions" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Overview of bookings, enquiries and website content.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map(({ label, value, Icon, href, warn, sub }) => (
          <Link
            key={label}
            href={href}
            className={`rounded-xl border bg-white p-5 shadow-sm transition hover:border-teal ${warn ? "border-amber-300" : "border-slate-200"}`}
          >
            <Icon size={20} className={warn ? "text-amber-600" : "text-teal"} aria-hidden />
            <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
            {sub && <p className="mt-1 text-xs font-semibold text-amber-700">{sub}</p>}
          </Link>
        ))}
      </div>

      {s.pendingBookings > 0 && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-900">
          <AlertTriangle size={18} className="shrink-0" />
          {s.pendingBookings} booking{s.pendingBookings > 1 ? "s are" : " is"} waiting for confirmation.
          <Link href="/admin/bookings?status=pending" className="ml-auto font-semibold underline">
            Review now
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold text-slate-900">Recent bookings</h2>
            <Link href="/admin/bookings" className="text-sm font-semibold text-teal">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-2.5 font-semibold">Client</th>
                  <th className="px-5 py-2.5 font-semibold">Service</th>
                  <th className="px-5 py-2.5 font-semibold">Preferred</th>
                  <th className="px-5 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {s.recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                      No bookings yet.
                    </td>
                  </tr>
                )}
                {s.recentBookings.map((b) => (
                  <tr key={String(b._id)}>
                    <td className="px-5 py-3 font-medium text-slate-900">{b.name}</td>
                    <td className="px-5 py-3 text-slate-600">{b.serviceName}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-600">{formatDate(b.preferredDate, { month: "short", day: "numeric" })}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${STATUS[b.status]}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold text-slate-900">Recent enquiries</h2>
            <Link href="/admin/bookings?tab=inquiries" className="text-sm font-semibold text-teal">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {s.recentInquiries.length === 0 && <li className="px-5 py-8 text-center text-sm text-slate-500">No enquiries yet.</li>}
            {s.recentInquiries.map((q) => (
              <li key={String(q._id)} className="px-5 py-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{q.name}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${STATUS[q.status]}`}>{q.status}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-slate-500">{q.message}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDate(q.createdAt)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
