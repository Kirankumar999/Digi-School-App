"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/logo.svg"
            alt="DigiSchool"
            className="w-14 h-14 rounded-xl object-contain shadow-lg animate-pulse"
          />
          <p className="text-slate-500 text-sm font-medium">Loading DigiSchool...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Header />
        <main className="flex-1 p-4 lg:p-5 overflow-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
