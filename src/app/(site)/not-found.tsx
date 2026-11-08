import Link from "next/link";
import { LotusMark } from "@/components/site/icons";

export default function NotFound() {
  return (
    <section className="container-lux py-28 text-center">
      <LotusMark size={64} className="mx-auto text-aqua" />
      <h1 className="heading-serif mt-6 text-5xl">Page not found</h1>
      <p className="mt-4 text-lg text-muted">The page you are looking for may have moved or no longer exists.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/services" className="btn-outline">
          View Services
        </Link>
      </div>
    </section>
  );
}
