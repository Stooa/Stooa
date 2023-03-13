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
import People from '@/ui/svg/people.svg';
import DoughnutChart from '../DoughnutChart';
import useFeedback from '@/hooks/useFeedback';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  fishbowl: Fishbowl;
  selected: boolean;
  onClick: (fishbowl: Fishbowl) => void;
}

const FinishedFishbowlCard = ({ fishbowl, selected, onClick }: Props) => {
  const { t } = useTranslation('fishbowl');
  const { name, startDateTimeTz, isPrivate } = fishbowl;
  const { summarizeFeedbackSatisfacion } = useFeedback(fishbowl);

  const startDateTime = new Date(startDateTimeTz);

  const month = startDateTime.toLocaleString('default', { month: 'long' });
  const day = startDateTime.toLocaleString('default', { day: 'numeric' });
  const time = startDateTime.toLocaleString('default', { hour: 'numeric', minute: 'numeric' });
  const year = startDateTime.toLocaleString('default', { year: 'numeric' });

  const summarizedFeedback = summarizeFeedbackSatisfacion();

  const handleClick = event => {
    if (!event.target.parentElement.classList.contains('card__actions')) {
      onClick({ ...fishbowl, summarizedFeedback });
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
          <p>{fishbowl.durationFormatted}h</p>
        </div>
        <div className="card__participants">
          <People />
          {fishbowl.participants?.length || 0}
        </div>
        <div className="card__chart">
          {summarizedFeedback ? (
            <>
              <h4>{t('feedback.dashboard.satisfaction')}</h4>
              <div className="card__chart-wrapper">
                <DoughnutChart feedbackSatisfaction={summarizedFeedback} />
              </div>
            </>
          ) : (
            <h4>{t('feedback.dashboard.noFeedback')}</h4>
          )}
        </div>
      </div>
    </CardStyled>
  );
};

export default FinishedFishbowlCard;
