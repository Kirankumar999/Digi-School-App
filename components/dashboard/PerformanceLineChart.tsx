"use client";

import { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { useTheme } from "@/lib/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function makeGradient(ctx: CanvasRenderingContext2D, hex: string) {
  const g = ctx.createLinearGradient(0, 0, 0, 280);
  g.addColorStop(0, hex + "55");
  g.addColorStop(1, hex + "00");
  return g;
}

export function PerformanceLineChart() {
  const ref = useRef<ChartJS<"line">>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const chart = ref.current;
    if (!chart) return;

    const css = getComputedStyle(document.documentElement);
    const brand1 = css.getPropertyValue("--brand-1").trim() || "#6366f1";
    const brand3 = css.getPropertyValue("--brand-3").trim() || "#ec4899";
    const brand4 = css.getPropertyValue("--brand-4").trim() || "#06b6d4";

    chart.data.datasets[0].borderColor = brand1;
    chart.data.datasets[1].borderColor = brand3;
    chart.data.datasets[2].borderColor = brand4;
    const ctx = chart.ctx;
    chart.data.datasets[0].backgroundColor = makeGradient(ctx, brand1);
    chart.data.datasets[1].backgroundColor = makeGradient(ctx, brand3);
    chart.data.datasets[2].backgroundColor = makeGradient(ctx, brand4);
    chart.update("none");
  }, [theme]);

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      { label: "Math", data: [78, 82, 85, 80, 88, 90, 86], borderColor: "#6366f1", backgroundColor: "rgba(99,102,241,0.2)", tension: 0.4, fill: true, borderWidth: 3, pointRadius: 0, pointHoverRadius: 6 },
      { label: "Science", data: [70, 74, 78, 82, 80, 84, 87], borderColor: "#ec4899", backgroundColor: "rgba(236,72,153,0.2)", tension: 0.4, fill: true, borderWidth: 3, pointRadius: 0, pointHoverRadius: 6 },
      { label: "English", data: [82, 80, 84, 86, 82, 85, 88], borderColor: "#06b6d4", backgroundColor: "rgba(6,182,212,0.2)", tension: 0.4, fill: true, borderWidth: 3, pointRadius: 0, pointHoverRadius: 6 },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    interaction: { mode: "nearest", intersect: false },
    scales: {
      x: {
        grid: { color: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)" },
        ticks: { color: theme === "dark" ? "#7a83a8" : "#94a3b8" },
      },
      y: {
        grid: { color: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)" },
        ticks: { color: theme === "dark" ? "#7a83a8" : "#94a3b8" },
        suggestedMin: 60,
        suggestedMax: 100,
      },
    },
  };

  return <Line ref={ref} data={data} options={options} />;
}
