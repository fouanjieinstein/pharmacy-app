import type { Metadata } from "next";
import { Manrope, Fraunces } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/lib/context/app-providers";
import { getSessionUser } from "@/lib/server/session";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.meridianhealth.example"),
  title: {
    default: "Meridian Health — Trusted Healthcare, Delivered Worldwide",
    template: "%s | Meridian Health",
  },
  description:
    "A premium international online pharmacy offering over-the-counter, prescription, and wellness products with pharmacist-reviewed dispensing and worldwide delivery.",
  openGraph: {
    title: "Meridian Health — Trusted Healthcare, Delivered Worldwide",
    description:
      "Licensed pharmacy services, pharmacist-reviewed prescriptions, and international delivery — from a premium international pharmacy.",
    siteName: "Meridian Health",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Resolve the session on the server so the first paint already reflects
  // signed-in state (no logged-out flash, no client round-trip).
  const sessionUser = await getSessionUser();
  // AuthProvider's client-side SessionUser type expects emailVerifiedAt as an
  // ISO string (matching every API response) rather than a Date instance.
  const user = sessionUser
    ? { ...sessionUser, emailVerifiedAt: sessionUser.emailVerifiedAt?.toISOString() ?? null }
    : null;

  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-brand-navy-900">
        <AppProviders initialUser={user}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200 focus:rounded-sm focus:bg-brand-navy-900 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
