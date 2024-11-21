import React, { FC } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import StagesBar from '../../components/stages-bar/StagesBar';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DealStagesDonutChartProps {
  data: { state: string; count: number; color: string }[];
}

const DealStagesDonutChart: FC<DealStagesDonutChartProps> = ({ data }) => {
  const stagesData = [
    { name: 'ASSIGNED LEAD', color: '#004E85' },
    { name: 'IN PROCESS', color: '#1C7EC3' },
    { name: 'OPPORTUNITY', color: '#1CBEC3' },
    { name: 'QUALIFICATION', color: '#EBDA25' },
    { name: 'NEGOTIATION', color: '#94C31C' },
    { name: 'CLOSED', color: '#075F18' }
];
  const chartData = {
    labels: data.map((stage) => stage.state),
    datasets: [
      {
        data: data.map((stage) => stage.count),
        backgroundColor: data.map((stage) => stage.color),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
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
    <div className="deal-stages-donut-chart">
      <div className='deal-overview-stages-bar'>
        <StagesBar stages={stagesData} vertical={true}/>
      </div>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DealStagesDonutChart;
