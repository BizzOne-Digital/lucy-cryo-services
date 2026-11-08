"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  ExternalLink,
  FileText,
  FolderUp,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelsTopLeft,
  Settings,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { LotusMark } from "@/components/site/icons";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", Icon: CalendarCheck },
  { href: "/admin/services", label: "Services", Icon: Sparkles },
  { href: "/admin/blogs", label: "Blogs", Icon: FileText },
  { href: "/admin/content", label: "Website Content", Icon: PanelsTopLeft },
  { href: "/admin/promotions", label: "Promotions", Icon: Tag },
  { href: "/admin/gallery", label: "Gallery", Icon: Images },
  { href: "/admin/uploads", label: "Uploads", Icon: FolderUp },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.replace("/admin/login");
    router.refresh();
  }

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <LotusMark size={36} className="text-aqua" />
        <div className="leading-tight">
          <p className="font-serif text-xl font-semibold text-white italic">Lucy CRYO</p>
          <p className="text-xs text-white/60">Admin Panel</p>
        </div>
      </div>
      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {LINKS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon size={18} aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white">
          <ExternalLink size={18} aria-hidden /> View website
        </a>
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} aria-hidden /> {loggingOut ? "Signing out..." : "Logout"}
        </button>
        <p className="truncate px-3 pt-2 text-xs text-white/40">{email}</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-navy px-4 py-3 lg:hidden">
        <span className="flex items-center gap-2 font-serif text-lg font-semibold text-white italic">
          <LotusMark size={28} className="text-aqua" /> Lucy CRYO Admin
        </span>
        <button type="button" onClick={() => setOpen(true)} className="rounded-lg p-2 text-white hover:bg-white/10" aria-label="Open admin menu">
          <Menu size={22} />
        </button>
      </div>
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-linear-to-b from-navy-deep to-navy lg:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-slate-900/50" aria-label="Close menu" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-72 bg-linear-to-b from-navy-deep to-navy">
            <button type="button" onClick={() => setOpen(false)} className="absolute top-4 right-3 rounded-lg p-2 text-white hover:bg-white/10" aria-label="Close admin menu">
              <X size={20} />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
