/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';
import FeedbackForm from '../FeedbackForm';
import { StyledButtonFeedback, StyledFeedbackWrapper } from './styles';
import { Fishbowl } from '@/types/api-platform';
import useTranslation from 'next-translate/useTranslation';
import { useStooa } from '@/contexts/StooaManager';

import Feedback from '@/ui/svg/feedback.svg';
import Chevron from '@/ui/svg/chevron-down.svg';
import PermissionsAlert from '@/ui/svg/permissions-alert.svg';

interface Props {
  fishbowl: Fishbowl;
  drawerOpened?: boolean;
  disabled?: boolean;
}

const ButtonFeedback = ({ fishbowl, drawerOpened = false, disabled = false }: Props) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const { t } = useTranslation('fishbowl');
  const { feedbackAlert, gaveFeedback, setGaveFeedback } = useStooa();

  const handleOpenFeedback = () => {
    setShowFeedbackForm(!showFeedbackForm);
  };

  const handleFinishFeedback = () => {
    setShowFeedbackForm(false);
  };

  return (
    <StyledFeedbackWrapper
      className={`${drawerOpened ? 'drawer-opened' : ''} ${disabled ? 'disabled' : ''}`}
    >
      {showFeedbackForm && (
        <FeedbackForm
          handleGaveSatisfaction={() => setGaveFeedback(true)}
          handleFinish={handleFinishFeedback}
          variant="fishbowl"
          fishbowl={fishbowl}
        />
      )}
      {feedbackAlert && !gaveFeedback && (
        <div className="alert" data-testid="permission-alert">
          <PermissionsAlert />
        </div>
      )}
      <StyledButtonFeedback
        active={showFeedbackForm}
        disabled={disabled}
        onClick={handleOpenFeedback}
        data-testid="feedback-button"
      >
        <Feedback />
        <span className="text medium body-xs">{t('feedback.title')}</span>
        <span className="chevron">
          <Chevron />
        </span>
      </StyledButtonFeedback>
    </StyledFeedbackWrapper>
  );
};

export default ButtonFeedback;
