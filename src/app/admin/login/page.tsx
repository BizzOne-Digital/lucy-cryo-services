import type { Metadata } from "next";
import { Suspense } from "react";
import { LotusMark } from "@/components/site/icons";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-linear-to-br from-navy-deep via-navy to-teal px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="text-center">
          <LotusMark size={56} className="mx-auto text-aqua" />
          <h1 className="mt-4 font-serif text-3xl font-semibold text-navy italic">Lucy CRYO Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage your website</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
