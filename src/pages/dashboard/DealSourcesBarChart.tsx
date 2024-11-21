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
    { name: 'NONE', color: '#004E85' },
    { name: 'CALL', color: '#1C7EC3' },
    { name: 'EMAIL', color: '#1CBEC3' },
    { name: 'EXISTING CUSTOMER', color: '#EBDA25' },
    { name: 'PARTNER', color: '#94C31C' },
    { name: 'PUBLIC RELATIONS', color: '#075F18' },
    { name: 'CAMPAIGN', color: '#075F18' },
    { name: 'WEBSITE', color: '#075F18' },
    { name: 'OTHER', color: '#075F18' },
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
