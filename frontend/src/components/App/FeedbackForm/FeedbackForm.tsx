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
import FeedbackSatisfaction from './FeedbackSatisfaction';
import FeedbackComment from './FeebackComment';

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

  return (
    <StyledFormWrapper>
      <AnimatePresence>
        {active === 'satisfaction' && (
          <FeedbackSatisfaction onSelectSatisfaction={handleSatisfactionFeedback} />
        )}
        {active === 'comment' && <FeedbackComment handleCommentFeedback={handleCommentFeedback} />}
        {active === 'mail' && <h2>Mail</h2>}
        {active === 'end' && <h2>End</h2>}
      </AnimatePresence>
    </StyledFormWrapper>
  );
};

export default FeedbackForm;
