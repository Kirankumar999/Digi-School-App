import type { Metadata } from "next";
// Self-hosted fonts (no network fetch — works behind corporate proxies/VPNs)
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/mukta/200.css";
import "@fontsource/mukta/300.css";
import "@fontsource/mukta/400.css";
import "@fontsource/mukta/500.css";
import "@fontsource/mukta/600.css";
import "@fontsource/mukta/700.css";
import "@fontsource/mukta/800.css";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { PWAInstall } from "@/components/PWAInstall";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "PradnyaShala - Intelligent School Administration Portal",
  description: "Comprehensive school administration dashboard for managing students, teachers, classes, and performance metrics.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Set theme before paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('edupulse-theme');if(!t){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full font-sans">
        <ThemeProvider>
          <AuthProvider>
            <LocaleProvider>
              {children}
              <OfflineIndicator />
              <PWAInstall />
              <ServiceWorkerRegistrar />
            </LocaleProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
