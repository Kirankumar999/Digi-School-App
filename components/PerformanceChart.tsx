"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const data = {
  labels: ["Math", "Science", "History", "English", "Arts", "English", "Arts"],
  datasets: [
    {
      label: "Avg Grade",
      data: [65, 55, 50, 60, 45, 58, 42],
      backgroundColor: "rgba(56, 189, 248, 0.8)",
      borderColor: "#38bdf8",
      borderWidth: 1,
      borderRadius: 4,
      barPercentage: 0.6,
      categoryPercentage: 0.7,
    },
    {
      label: "Performance %",
      data: [72, 60, 45, 68, 50, 55, 38],
      backgroundColor: "rgba(16, 185, 129, 0.8)",
      borderColor: "#10b981",
      borderWidth: 1,
      borderRadius: 4,
      barPercentage: 0.6,
      categoryPercentage: 0.7,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#0f1b2d",
      titleFont: { family: "Inter", size: 11 },
      bodyFont: { family: "Inter", size: 11 },
      padding: 10,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 4,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 80,
      ticks: { font: { family: "Inter", size: 10 }, color: "#94a3b8", stepSize: 10 },
      grid: { color: "#f1f5f9" },
    },
    x: {
      ticks: { font: { family: "Inter", size: 10 }, color: "#94a3b8" },
      grid: { display: false },
    },
  },
} as const;

export function PerformanceChart() {
  return (
    <div>
      <h2 className="text-sm font-bold text-slate-800 mb-1">Student Performance Progress</h2>
      <div className="flex flex-wrap items-center justify-between gap-1 mb-3">
        <p className="text-[11px] text-slate-500 font-medium">Average Student Performance</p>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-sky" />Avg Grade
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-emerald" />Performance %
          </span>
        </div>
      </div>
      <div className="h-48">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
