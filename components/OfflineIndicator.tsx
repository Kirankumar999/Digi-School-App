"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";

export function OfflineIndicator() {
  const { t } = useLocale();
  const [online, setOnline] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setOnline(navigator.onLine));

    const handleOnline = () => { setOnline(true); setShow(true); setTimeout(() => setShow(false), 3000); };
    const handleOffline = () => { setOnline(false); setShow(true); };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!show && online) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all duration-300 ${
        online
          ? "bg-emerald-500 text-white"
          : "bg-red-500 text-white animate-pulse"
      }`}
    >
      {online ? t("pwa.backOnline") : t("pwa.offline")}
    </div>
  );
}
