/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { forwardRef, RefObject, useCallback, useState } from 'react';
import { StyledFormWrapper } from './styles';
import { AnimatePresence } from 'framer-motion';
import useFeedback from '@/hooks/useFeedback';
import StepSatisfaction from './StepSatisfaction';
import StepComment from './StepComment';
import StepMail from './StepMail';
import StepEnd from './StepEnd';
import { Fishbowl } from '@/types/api-platform';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  variant: 'fishbowl' | 'fishbowl-mobile' | 'thankyou';
  fishbowl: Fishbowl;
  handleFinish?: () => void;
  handleGaveSatisfaction?: () => void;
  ref?: RefObject<HTMLDivElement>;
}

const FeedbackForm = forwardRef<HTMLDivElement, Props>(
  ({ variant, fishbowl, handleFinish, handleGaveSatisfaction }, ref) => {
    const [active, setActive] = useState<
      'satisfaction' | 'commentBad' | 'commentGood' | 'mail' | 'end'
    >('satisfaction');

    const { createFeedback, updateFeedback } = useFeedback(fishbowl);
    const { isAuthenticated } = useAuth();

    const handleSatisfactionFeedback = (satisfactionLevel: 'sad' | 'neutral' | 'happy') => {
      if (variant === 'thankyou') {
        createFeedback(satisfactionLevel, 'thank-you');
      } else {
        createFeedback(satisfactionLevel, 'fishbowl');
      }

      handleGaveSatisfaction && handleGaveSatisfaction();

      if (satisfactionLevel === 'sad' || satisfactionLevel === 'neutral') {
        setActive('commentBad');
      } else {
        setActive('commentGood');
      }
    };

    const handleCommentFeedback = (comment: string) => {
      updateFeedback({ type: 'comment', data: comment });
      setActive('mail');
    };

    const handleMailFeedback = (email: string) => {
      updateFeedback({ type: 'email', data: email });
      setActive('end');
    };

    const handleSkip = useCallback(() => {
      switch (active) {
        case 'commentBad':
        case 'commentGood':
          if (isAuthenticated) {
            setActive('end');
            break;
          }
          setActive('mail');
          break;
        case 'mail':
          setActive('end');
          break;
        default:
          break;
      }
    }, [active]);

    return (
      <AnimatePresence mode="wait">
        <StyledFormWrapper key="wrapper" className={variant} ref={ref} data-testid="feedback-form">
          {active === 'satisfaction' && (
            <StepSatisfaction onSelectSatisfaction={handleSatisfactionFeedback} />
          )}
          {(active === 'commentGood' || active === 'commentBad') && (
            <StepComment
              handleSkip={handleSkip}
              handleCommentFeedback={handleCommentFeedback}
              title={
                active === 'commentGood'
                  ? 'feedback.commentWhatDidYouLike'
                  : 'feedback.commentImproveTitle'
              }
            />
          )}
          {active === 'mail' && (
            <StepMail key="mail" handleSkip={handleSkip} handleMailFeedback={handleMailFeedback} />
          )}
          {active === 'end' && <StepEnd handleFinish={handleFinish} variant={variant} />}
        </StyledFormWrapper>
      </AnimatePresence>
    );
  }
);

export default FeedbackForm;
