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

interface Props {
  feedbacks: Feedback[];
}

const FeedbackList = ({ feedbacks }: Props) => {
  const FeedbackSVG = {
    sad: Bad,
    neutral: Okay,
    happy: Love
  };

  return (
    <StyledFeedbackWrapper>
      {feedbacks.map((feedback, index) => {
        const Component = FeedbackSVG[feedback.satisfaction];

        return (
          <div key={feedback['@id']} className="feedback">
            <div className="feedback__title body-md">
              <h4 className="body-md">holahola</h4>
              <span className="feedback__pill body-xs medium">
                {feedback.origin === 'thankyou' ? 'after' : 'during'}
              </span>
            </div>
            {feedback.email && <p className="medium body-xs">{feedback.email}</p>}
            {feedback.comment && <p className="feedback__comment">{feedback.comment}</p>}
            <div className="feedback__satisfaction">
              <Component />
              <p className="medium body-xs">{feedback.satisfaction}</p>
            </div>
            {feedbacks.length - 1 !== index && <hr className="feedback__separator" />}
          </div>
        );
      })}
    </StyledFeedbackWrapper>
  );
};

export default FeedbackList;
