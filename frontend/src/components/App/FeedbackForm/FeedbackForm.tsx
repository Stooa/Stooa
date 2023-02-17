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
import { motion, AnimatePresence } from 'framer-motion';
import useFeedback from '@/hooks/useFeedback';
import FeedbackSatisfaction from './FeedbackSatisfaction';

const FeedbackForm = () => {
  const [active, setActive] = useState<'satisfaction' | 'comment' | 'mail' | 'end'>('satisfaction');

  const { createFeedback, updateFeedback } = useFeedback();

  const handleNext = () => {};

  const handleSatisfactionFeedback = (level: string) => {
    console.log(level);
  };

  return (
    <StyledFormWrapper>
      {active === 'satisfaction' && (
        <AnimatePresence>
          <FeedbackSatisfaction onSelectSatisfaction={handleSatisfactionFeedback} />
        </AnimatePresence>
      )}
      {active === 'comment' && <h2>Comment</h2>}
      {active === 'mail' && <h2>Mail</h2>}
      {active === 'end' && <h2>End</h2>}
    </StyledFormWrapper>
  );
};

export default FeedbackForm;
