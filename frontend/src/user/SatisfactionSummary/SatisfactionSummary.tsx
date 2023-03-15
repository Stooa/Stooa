/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SatisfactionData } from '@/types/feedback';
import DoughnutChart from '../DoughnutChart';
import { StyledSummaryWrapper } from './styles';
import useTranslation from 'next-translate/useTranslation';

import Bad from '@/ui/svg/emojis/feedback/bad.svg';
import Okay from '@/ui/svg/emojis/feedback/okay.svg';
import Love from '@/ui/svg/emojis/feedback/love.svg';

interface Props {
  satisfactionData: SatisfactionData | null;
  personsGaveFeedback: number;
}

const SatisfactionSummary = ({ satisfactionData, personsGaveFeedback }: Props) => {
  const { t } = useTranslation('fishbowl');
  return (
    <StyledSummaryWrapper className={!satisfactionData ? 'empty' : ''}>
      {!satisfactionData && (
        <div className="empty__wrapper">
          <p className="body-md">{t('feedback.dashboard.noFeedback')}</p>
        </div>
      )}

      <div className="summary__general">
        <div className="chart-wrapper">
          <DoughnutChart feedbackSatisfaction={satisfactionData} />
        </div>
        <div>
          <span className="body-lg">{personsGaveFeedback}</span>
          <p>
            {personsGaveFeedback > 1
              ? t('feedback.dashboard.feedbackReceived_other')
              : t('feedback.dashboard.feedbackReceived_one')}
          </p>
        </div>
      </div>

      <div className="summary__detail">
        <div>
          <span data-testid="feedback-summary-sad">{satisfactionData?.sad || 0}</span>
          <Bad />
          <p>{t('feedback.notMuch')}</p>
        </div>
        <div>
          <span data-testid="feedback-summary-neutral">{satisfactionData?.neutral || 0}</span>
          <Okay />
          <p>{t('feedback.okay')}</p>
        </div>
        <div>
          <span data-testid="feedback-summary-great">{satisfactionData?.happy || 0}</span>
          <Love />
          <p>{t('feedback.great')}</p>
        </div>
      </div>
    </StyledSummaryWrapper>
  );
};

export default SatisfactionSummary;
