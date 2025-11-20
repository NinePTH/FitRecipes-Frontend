import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineChartProps {
  title?: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }>;
  height?: number;
}

export const LineChart = ({ title, labels, datasets, height = 300 }: LineChartProps) => {
  const colors = [
    { border: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.1)' }, // blue
    { border: 'rgb(16, 185, 129)', bg: 'rgba(16, 185, 129, 0.1)' }, // green
    { border: 'rgb(239, 68, 68)', bg: 'rgba(239, 68, 68, 0.1)' }, // red
    { border: 'rgb(245, 158, 11)', bg: 'rgba(245, 158, 11, 0.1)' }, // orange
    { border: 'rgb(139, 92, 246)', bg: 'rgba(139, 92, 246, 0.1)' }, // purple
  ];

  const data = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: dataset.borderColor || colors[index % colors.length].border,
      backgroundColor: dataset.backgroundColor || colors[index % colors.length].bg,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    })),
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      title: title
        ? {
            display: true,
            text: title,
            font: {
              size: 16,
              weight: 'bold',
            },
            padding: 20,
          }
        : {
            display: false,
          },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          precision: 0,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={data} options={options} />
    </div>
  );
};
