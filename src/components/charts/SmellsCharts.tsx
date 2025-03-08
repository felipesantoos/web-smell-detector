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

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11
          }
        }
      },
    },
  };

  const barAndLineOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 11
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 11
          },
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Distribution of Smells</h3>
        <div className="h-[300px] sm:h-[350px]">
          <Pie data={pieData} options={commonOptions} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Smell Counts</h3>
        <div className="h-[300px] sm:h-[350px]">
          <Bar data={barData} options={barAndLineOptions} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Smell Trends</h3>
        <div className="h-[300px] sm:h-[350px]">
          <Line data={lineData} options={barAndLineOptions} />
        </div>
      </div>
    </div>
  );
}