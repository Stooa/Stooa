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
  satisfactionData: SatisfactionData;
  participants: number;
  personsGaveFeedback: number;
}

const SatisfactionSummary = ({ satisfactionData, personsGaveFeedback, participants }: Props) => {
  const { t } = useTranslation('fishbowl');
  return (
    <StyledSummaryWrapper>
      <div className="summary__general">
        <div className="chart-wrapper">
          <DoughnutChart feedbackSatisfaction={satisfactionData} />
        </div>
        <div>
          <span className="body-lg">
            {personsGaveFeedback}/{participants}
          </span>
          <p>Participants</p>
        </div>
      </div>

      <div className="summary__detail">
        <div>
          <span>{satisfactionData.sad}</span>
          <Bad />
          <p>{t('feedback.notMuch')}</p>
        </div>
        <div>
          <span>{satisfactionData.neutral}</span>
          <Okay />
          <p>{t('feedback.okay')}</p>
        </div>
        <div>
          <span>{satisfactionData.happy}</span>
          <Love />
          <p>{t('feedback.great')}</p>
        </div>
      </div>
    </StyledSummaryWrapper>
  );
};

export default SatisfactionSummary;
