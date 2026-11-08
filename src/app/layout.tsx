import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { getSettings } from "@/lib/data";
import { introBootScript } from "@/components/site/IntroSplash";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: s.seoTitle, template: `%s | ${s.businessName}` },
    description: s.seoDescription,
    applicationName: s.businessName,
    openGraph: {
      type: "website",
      siteName: s.businessName,
      title: s.seoTitle,
      description: s.seoDescription,
      locale: "en_CA",
      ...(s.ogImage ? { images: [{ url: s.ogImage }] } : {}),
    },
    twitter: { card: "summary_large_image", title: s.seoTitle, description: s.seoDescription },
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = { themeColor: "#003B5C", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
      </head>
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
