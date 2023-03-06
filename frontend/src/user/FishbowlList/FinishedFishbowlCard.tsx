/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Fishbowl } from '@/types/api-platform';

import { CardStyled, CardTitle } from '@/user/FishbowlList/styles';
import { convertIntoClassName } from '@/lib/helpers';
import Icon from '@/components/Common/Fields/Icon';
import { Chart as ChartJS, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement);

const feedbackData = {
  labels: ['bad', 'good', 'great'],
  datasets: [
    {
      label: 'Feedback',
      data: [12, 4, 3],
      backgroundColor: ['#5DDBD0', '#EEDE96', '#FCBAB6'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
};

interface Props {
  fishbowl: Fishbowl;
  selected?: boolean;
  onClick: (fishbowl: Fishbowl) => void;
}

const FinishedFishbowlCard = ({ fishbowl, selected, onClick }: Props) => {
  // const { t } = useTranslation('fishbowl-list');
  const { name, startDateTimeTz, isPrivate } = fishbowl;

  const startDateTime = new Date(startDateTimeTz);

  const month = startDateTime.toLocaleString('default', { month: 'long' });
  const day = startDateTime.toLocaleString('default', { day: 'numeric' });
  const time = startDateTime.toLocaleString('default', { hour: 'numeric', minute: 'numeric' });
  const year = startDateTime.toLocaleString('default', { year: 'numeric' });

  const handleClick = event => {
    if (!event.target.parentElement.classList.contains('card__actions')) {
      onClick(fishbowl);
    }
  };

  return (
    <CardStyled
      className={`finished ${selected ? 'selected-card' : ''}`}
      onClick={handleClick}
      data-testid={convertIntoClassName(name)}
    >
      <CardTitle>
        {isPrivate && (
          <span className="icon-wrapper">
            <Icon variant="lock" />
          </span>
        )}
        <h4>{name}</h4>
      </CardTitle>
      <div data-testid="card-info" className="card__info body-md">
        <div className="card__date">
          <div>
            {month} {day}, {year}
          </div>
          <div className="card__time">{time}</div>
        </div>
        <div className="card__duration">
          <p>46 min</p>
        </div>
        <div className="card__participants">
          <div>12</div>
        </div>
        <div className="card__chart">
          <h4>Satisfaction</h4>
          <div className="card__chart-wrapper">
            <Doughnut data={feedbackData} options={chartOptions} />
          </div>
        </div>
      </div>
    </CardStyled>
  );
};

export default FinishedFishbowlCard;
