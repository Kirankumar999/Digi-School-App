"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type Variant = "s1" | "s2" | "s3" | "s4";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: string;
  trend?: "up" | "down";
  icon: ReactNode;
  variant: Variant;
}

function useCountUp(target: number, decimals = 0, durationMs = 1100) {
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return val.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function StatCard({
  label, value, prefix = "", suffix = "", decimals = 0, delta, trend = "up", icon, variant,
}: StatCardProps) {
  const display = useCountUp(value, decimals);
  return (
    <div className={`ep-stat ${variant}`}>
      <div className="ep-stat-icon">{icon}</div>
      <div className="ep-stat-body">
        <div className="ep-stat-label">{label}</div>
        <div className="ep-stat-value">
          {prefix}
          {display}
          {suffix}
        </div>
        {delta && (
          <div className="ep-stat-delta">
            {trend === "up" ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8M14 7h7v7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l6 6 4-4 8 8M14 17h7v-7" />
              </svg>
            )}
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}
