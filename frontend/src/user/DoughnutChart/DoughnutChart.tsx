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
  cutout: '62%',
  maintainAspectRatio: false,
  elements: {
    arc: {
      borderWidth: 0
    }
  }
};

interface Props {
  feedbackSatisfaction: SatisfactionData | null;
}

const DoughnutChart = ({ feedbackSatisfaction }: Props) => {
  const dataInArr = Object.values(feedbackSatisfaction || { okay: 2, good: 4, bad: 1 });

  const feedbackData = {
    labels: ['sad', 'okay', 'great'],
    datasets: [
      {
        label: 'Feedback',
        data: dataInArr,
        backgroundColor: ['#EEDE96', '#5DDBD0', '#FCBAB6'],
        hoverBackgroundColor: ['#EEDE96', '#5DDBD0', '#FCBAB6']
      }
    ]
  };
  return <Doughnut data={feedbackData} options={chartOptions} />;
};

export default DoughnutChart;
