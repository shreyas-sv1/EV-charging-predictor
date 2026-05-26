import React from 'react';
import { Bar } from 'react-chartjs-2';
import { FEATURE_IMPORTANCES } from '../utils/prediction';
import './FeatureChart.css';

const FeatureChart: React.FC = () => {
  const data = {
    labels: FEATURE_IMPORTANCES.map((f) => f.feature),
    datasets: [
      {
        label: 'Importance',
        data: FEATURE_IMPORTANCES.map((f) => f.importance),
        backgroundColor: FEATURE_IMPORTANCES.map((f) => f.color + 'cc'),
        borderColor: FEATURE_IMPORTANCES.map((f) => f.color),
        borderWidth: 1.5,
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0d1628',
        borderColor: '#2a4070',
        borderWidth: 1,
        titleColor: '#f1f5fb',
        bodyColor: '#8090aa',
        callbacks: {
          label: (ctx: any) => `  Importance: ${(ctx.raw as number).toFixed(3)} (${(ctx.raw * 100).toFixed(1)}%)`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(30,46,74,0.8)', drawBorder: false },
        ticks: { color: '#4e6080', font: { size: 11 } },
        max: 0.6,
        border: { display: false },
      },
      y: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#8090aa', font: { size: 11 } },
        border: { display: false },
      },
    },
  };

  return (
    <div className="feature-chart-container">
      <Bar data={data} options={options} />
    </div>
  );
};

export default FeatureChart;
