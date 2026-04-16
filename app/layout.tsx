import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { PWAInstall } from "@/components/PWAInstall";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "DigiSchool - School Administration Portal",
  description: "Comprehensive school administration dashboard for managing students, teachers, classes, and performance metrics.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0d9488",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Mukta:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-slate-100 font-sans">
        <AuthProvider>
          <LocaleProvider>
            {children}
            <OfflineIndicator />
            <PWAInstall />
            <ServiceWorkerRegistrar />
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
