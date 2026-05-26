import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HOURLY_BASE } from '../utils/prediction';
import './HourlyChart.css';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler
);

interface Props {
  selectedHour: number;
  predictedDemand: number | null;
  demandColor: string;
}

const labels = Array.from({ length: 24 }, (_, i) =>
  i === 0 ? '12am' :
  i < 12 ? `${i}am` :
  i === 12 ? '12pm' :
  `${i - 12}pm`
);

const HourlyChart: React.FC<Props> = ({ selectedHour, predictedDemand, demandColor }) => {
  const pointData = Array(24).fill(null);
  if (predictedDemand !== null) pointData[selectedHour] = predictedDemand;

  const data = {
    labels,
    datasets: [
      {
        label: 'Base Demand',
        data: HOURLY_BASE,
        borderColor: '#00e5ff',
        backgroundColor: 'rgba(0,229,255,0.07)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.45,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#00e5ff',
      },
      {
        label: 'Your Prediction',
        data: pointData,
        borderColor: demandColor,
        backgroundColor: demandColor,
        pointRadius: pointData.map((v) => (v !== null ? 10 : 0)),
        pointHoverRadius: 13,
        pointBackgroundColor: demandColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 2.5,
        showLine: false,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    animation: { duration: 600 },
    plugins: {
      legend: {
        labels: {
          color: '#8090aa',
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 12, family: 'Inter' },
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: '#0d1628',
        borderColor: '#2a4070',
        borderWidth: 1,
        titleColor: '#f1f5fb',
        bodyColor: '#8090aa',
        padding: 12,
        callbacks: {
          label: (ctx: any) => {
            if (ctx.raw === null) return null;
            return `  ${ctx.dataset.label}: ${ctx.raw} units`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(30,46,74,0.8)', drawBorder: false },
        ticks: {
          color: '#4e6080',
          maxTicksLimit: 12,
          font: { size: 11, family: 'Inter' },
        },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(30,46,74,0.8)', drawBorder: false },
        ticks: {
          color: '#4e6080',
          font: { size: 11, family: 'Inter' },
          callback: (v: any) => `${v}`,
        },
        min: 0,
        max: 100,
        border: { display: false },
      },
    },
  };

  return (
    <div className="hourly-chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default HourlyChart;
