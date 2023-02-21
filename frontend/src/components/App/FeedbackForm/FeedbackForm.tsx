/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';
import { StyledFormWrapper } from './styles';
import { AnimatePresence } from 'framer-motion';
import useFeedback from '@/hooks/useFeedback';
import StepSatisfaction from './StepSatisfaction';
import StepComment from './StepComment';
import StepMail from './StepMail';

const FeedbackForm = () => {
  const [active, setActive] = useState<'satisfaction' | 'comment' | 'mail' | 'end'>('satisfaction');

  const { createFeedback, updateFeedback } = useFeedback();

  const handleSatisfactionFeedback = (satisfactionLevel: 'sad' | 'neutral' | 'happy') => {
    createFeedback(satisfactionLevel, 'fishbowl');
    setActive('comment');
  };

  const handleCommentFeedback = (comment: string) => {
    console.log('comment', comment);
    updateFeedback({ type: 'comment', data: comment });
    setActive('mail');
  };

  const handleMailFeedback = (email: string) => {
    console.log('EMAIL', email);
    updateFeedback({ type: 'email', data: email });
    setActive('end');
  };

  return (
    <StyledFormWrapper>
      <AnimatePresence>
        {active === 'satisfaction' && (
          <StepSatisfaction onSelectSatisfaction={handleSatisfactionFeedback} />
        )}
        {active === 'comment' && <StepComment handleCommentFeedback={handleCommentFeedback} />}
        {active === 'mail' && <StepMail handleMailFeedback={handleMailFeedback} />}
        {active === 'end' && <h2>End</h2>}
      </AnimatePresence>
    </StyledFormWrapper>
  );
};

export default FeedbackForm;
