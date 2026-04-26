"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="ep-brand-mark animate-pulse" style={{ width: 56, height: 56 }}>
            <Image
              src="/PradnyaShala.png"
              alt="PradnyaShala"
              width={56}
              height={56}
              className="w-full h-full object-contain p-1.5 relative z-[1]"
              priority
            />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-mute)" }}>
            Loading PradnyaShala...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <div className="ep-bg-decor" />
      <div className="relative z-[1] flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          <Header />
          <main className="flex-1 px-4 lg:px-7 py-6 ep-fade-up">{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
}
