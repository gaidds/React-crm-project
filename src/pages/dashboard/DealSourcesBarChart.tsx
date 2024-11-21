import React, { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface DealSourcesBarChartProps {
  data: Record<string, number>;
}

const DealSourcesBarChart: FC<DealSourcesBarChartProps> = ({ data }) => {
  const sourcesData = [
    { name: 'NONE', color: '#F4B400' }, // Yellow-Orange
    { name: 'CALL', color: '#4285F4' }, // Blue
    { name: 'EMAIL', color: '#1CBEC3' }, // Greenish
    { name: 'EXISTING CUSTOMER', color: '#5555FF' }, // Bright Blue
    { name: 'PARTNER', color: '#FF4444' }, // Reddish
    { name: 'PUBLIC RELATIONS', color: '#0A7300' }, // Dark Green
    { name: 'CAMPAIGN', color: '#FF8900' }, // Orange
    { name: 'WEBSITE', color: '#00D9E2' }, // Light Cyan
    { name: 'OTHER', color: '#FF00FF' }, // Magenta
  ];

  // Match colors based on data keys
  const chartLabels = Object.keys(data); // Extract labels (e.g., "NONE", "CAMPAIGN")
  const chartCounts = Object.values(data); // Extract counts
  const chartColors = chartLabels.map(
    (label) =>
      sourcesData.find((source) => source.name === label)?.color || '#000000' // Default to black if no color is found
  );

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartCounts,
        backgroundColor: chartColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) =>
            `${tooltipItem.label}: ${tooltipItem.raw} deals`,
        },
      },
    },
  };

  return (
    <div className="deal-sources-bar-chart">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DealSourcesBarChart;
