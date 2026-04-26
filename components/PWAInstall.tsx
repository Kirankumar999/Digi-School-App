"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstall() {
  const { t } = useLocale();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem("pwa_install_dismissed");
      if (!dismissed) setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("pwa_install_dismissed", "1");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] bg-white rounded-xl shadow-2xl border border-slate-200 p-4 max-w-xs animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-start gap-3">
        <Image
          src="/PradnyaShala.png"
          alt="PradnyaShala"
          width={40}
          height={40}
          className="w-10 h-10 rounded-lg object-contain shrink-0 shadow-md"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">{t("pwa.install")}</p>
          <p className="text-xs text-slate-500 mt-0.5">{t("pwa.installDescription")}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={install} className="px-3 py-1.5 bg-teal text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-teal-dark transition">{t("pwa.installButton")}</button>
            <button onClick={dismiss} className="px-3 py-1.5 text-slate-500 hover:text-slate-700 text-xs font-medium cursor-pointer">{t("pwa.notNow")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
