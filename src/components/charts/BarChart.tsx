import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  title?: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
  height?: number;
}

export const BarChart = ({ title, labels, datasets, height = 300 }: BarChartProps) => {
  const colors = [
    { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgb(59, 130, 246)' }, // blue
    { bg: 'rgba(16, 185, 129, 0.8)', border: 'rgb(16, 185, 129)' }, // green
    { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgb(239, 68, 68)' }, // red
    { bg: 'rgba(245, 158, 11, 0.8)', border: 'rgb(245, 158, 11)' }, // orange
    { bg: 'rgba(139, 92, 246, 0.8)', border: 'rgb(139, 92, 246)' }, // purple
  ];

  const data = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || colors[index % colors.length].bg,
      borderColor: dataset.borderColor || colors[index % colors.length].border,
      borderWidth: 1,
    })),
  };

  const options: ChartOptions<'bar'> = {
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
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bar data={data} options={options} />
    </div>
  );
};
