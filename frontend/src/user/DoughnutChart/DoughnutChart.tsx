/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement } from 'chart.js';
import { SatisfactionData } from '@/types/feedback';

ChartJS.register(ArcElement);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
};

interface Props {
  feedbackSatisfaction: SatisfactionData;
}

const DoughnutChart = ({ feedbackSatisfaction }: Props) => {
  const dataInArr = Object.values(feedbackSatisfaction);

  const feedbackData = {
    labels: ['bad', 'good', 'great'],
    datasets: [
      {
        label: 'Feedback',
        data: dataInArr,
        backgroundColor: ['#5DDBD0', '#EEDE96', '#FCBAB6'],
        hoverBackgroundColor: ['#5DDBD0', '#EEDE96', '#FCBAB6']
      }
    ]
  };
  return <Doughnut data={feedbackData} options={chartOptions} />;
};

export default DoughnutChart;
