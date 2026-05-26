import React from 'react';
import { Bar } from 'react-chartjs-2';
import './AnalyticsDashboard.css';

const makeDataset = (data: number[], colors: string[]) => ({
  datasets: [{
    data,
    backgroundColor: colors.map((c) => c + 'bb'),
    borderColor: colors,
    borderWidth: 1.5,
    borderRadius: 6,
    borderSkipped: false,
  }],
});

const chartOptions = (labels: string[], max: number) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 600 },
  plugins: { legend: { display: false }, tooltip: {
    backgroundColor: '#0d1628',
    borderColor: '#2a4070',
    borderWidth: 1,
    titleColor: '#f1f5fb',
    bodyColor: '#8090aa',
  }},
  scales: {
    x: {
      grid: { display: false, drawBorder: false },
      ticks: { color: '#4e6080', font: { size: 10 } },
      border: { display: false },
    },
    y: {
      grid: { color: 'rgba(30,46,74,0.5)', drawBorder: false },
      ticks: { color: '#4e6080', font: { size: 10 } },
      max,
      border: { display: false },
    },
  },
});

const CHARTS = [
  {
    title: 'Demand by Time Slot',
    labels: ['Peak', 'Off-Peak'],
    data: [84, 35],
    colors: ['#00e676', '#4e6080'],
    max: 100,
    unit: 'units',
  },
  {
    title: 'Energy by Location',
    labels: ['Urban', 'Highway'],
    data: [39, 39],
    colors: ['#00e5ff', '#2979ff'],
    max: 60,
    unit: 'kWh',
  },
  {
    title: 'Demand by Weather',
    labels: ['Clear', 'Cloudy', 'Rainy'],
    data: [58, 53, 48],
    colors: ['#ffab00', '#8090aa', '#2979ff'],
    max: 80,
    unit: 'units',
  },
  {
    title: 'Demand by Day',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [54, 55, 53, 56, 58, 48, 45],
    colors: ['#00e5ff','#00e5ff','#00e5ff','#00e5ff','#00e676','#7c3aed','#7c3aed'],
    max: 80,
    unit: 'units',
  },
];

const AnalyticsDashboard: React.FC = () => (
  <div className="analytics-dashboard">
    {CHARTS.map((c) => (
      <div key={c.title} className="analytics-card panel">
        <div className="analytics-card-header">
          <h4 className="analytics-title">{c.title}</h4>
          <span className="analytics-unit">{c.unit}</span>
        </div>
        <div className="analytics-chart-area">
          <Bar
            data={{ labels: c.labels, ...makeDataset(c.data, c.colors) }}
            options={chartOptions(c.labels, c.max)}
          />
        </div>
      </div>
    ))}
  </div>
);

export default AnalyticsDashboard;
