"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function AttendanceDoughnut() {
  const data: ChartData<"doughnut"> = {
    labels: ["Present", "Absent", "Late"],
    datasets: [
      {
        data: [2683, 102, 62],
        backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: { legend: { display: false } },
  };

  return <Doughnut data={data} options={options} />;
}
