/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import { Feedback } from '@/types/api-platform/interfaces/feedback';
import { StyledFeedbackWrapper } from './styles';

import Bad from '@/ui/svg/emojis/feedback/bad.svg';
import Okay from '@/ui/svg/emojis/feedback/okay.svg';
import Love from '@/ui/svg/emojis/feedback/love.svg';
import PillWithTooltip from '../PillWithTooltip';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  feedbacks: Feedback[];
}

const FeedbackList = ({ feedbacks }: Props) => {
  const { t } = useTranslation('fishbowl');
  const FeedbackSVG = {
    sad: Bad,
    neutral: Okay,
    happy: Love
  };

  return (
    <StyledFeedbackWrapper data-testid="feedback-list">
      {feedbacks.map((feedback, index) => {
        const Component = FeedbackSVG[feedback.satisfaction];

        return (
          <div key={feedback['@id']} className="feedback">
            <div className="feedback__title body-md">
              <h4 className="body-md" data-testid="feedback-name">
                {feedback.participant?.user
                  ? `${feedback.participant.user?.name} ${feedback.participant.user.surnames}`
                  : feedback.participant?.guest?.name}
              </h4>
              <PillWithTooltip
                tooltipText={
                  feedback.origin === 'thank-you'
                    ? t('feedback.dashboard.afterTooltip')
                    : t('feedback.dashboard.duringTooltip')
                }
              >
                {feedback.origin === 'thank-you'
                  ? t('feedback.dashboard.after')
                  : t('feedback.dashboard.during')}
              </PillWithTooltip>
            </div>
            {feedback.email && (
              <p
                data-testid="feedback-email"
                className={`medium body-xs feedback__mail ${!feedback.comment ? 'spaced' : ''}`}
              >
                {feedback.email}
              </p>
            )}
            {feedback.comment && <p className="feedback__comment">{feedback.comment}</p>}
            <div className="feedback__satisfaction">
              <Component />
              <p className="medium body-xs" data-testid="feedback-satisfaction">
                {feedback.satisfaction}
              </p>
            </div>
            {feedbacks.length - 1 !== index && <hr className="feedback__separator" />}
          </div>
        );
      })}
    </StyledFeedbackWrapper>
  );
};

export default FeedbackList;
