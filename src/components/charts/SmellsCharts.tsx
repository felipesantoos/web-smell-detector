import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import type { SmellMetric } from '../../types';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

interface SmellsChartsProps {
  metrics: SmellMetric[];
}

export function SmellsCharts({ metrics }: SmellsChartsProps) {
  const labels = metrics.map(metric => metric.name);
  const counts = metrics.map(metric => metric.count);
  const colors = metrics.map(metric => metric.color.replace('text-', 'rgb('));

  const pieData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.8)')),
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: 'Number of Smells',
        data: counts,
        backgroundColor: colors.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.6)')),
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Smell Distribution',
        data: counts,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution of Smells</h3>
        <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom' } } }} />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Smell Counts</h3>
        <Bar data={barData} options={options} />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Smell Trends</h3>
        <Line data={lineData} options={options} />
      </div>
    </div>
  );
}