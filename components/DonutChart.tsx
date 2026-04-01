interface DonutChartProps {
  percentage: number;
  gradientId: string;
  colorStart: string;
  colorEnd: string;
  textColor: string;
  size?: "sm" | "lg";
}

export function DonutChart({ percentage, gradientId, colorStart, colorEnd, textColor, size = "sm" }: DonutChartProps) {
  const isLg = size === "lg";
  const dim = isLg ? "w-[90px] h-[90px]" : "w-[70px] h-[70px]";
  const labelSize = isLg ? "text-sm" : "text-[11px]";
  const strokeW = isLg ? 2.5 : 3;
  const gap = 100 - percentage;

  return (
    <div className={`relative ${dim}`}>
      <svg viewBox="0 0 36 36" className="-rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth={strokeW} />
        <circle
          cx="18"
          cy="18"
          r="15.9"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeW}
          strokeDasharray={`${percentage} ${gap}`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: colorStart }} />
            <stop offset="100%" style={{ stopColor: colorEnd }} />
          </linearGradient>
        </defs>
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center ${labelSize} font-bold ${textColor}`}>
        {percentage}%
      </div>
    </div>
  );
}
