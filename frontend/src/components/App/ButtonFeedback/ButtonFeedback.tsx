/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useRef, useState } from 'react';
import FeedbackForm from '../FeedbackForm';
import { StyledButtonFeedback, StyledFeedbackWrapper } from './styles';
import { Fishbowl } from '@/types/api-platform';
import { useClickOutside } from '@/hooks/useClickOutside';
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
  const { feedbackAlert } = useStooa();

  const handleOpenFeedback = () => {
    setShowFeedbackForm(!showFeedbackForm);
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = () => setShowFeedbackForm(false);

  useClickOutside(wrapperRef, handleClickOutside);

  return (
    <StyledFeedbackWrapper ref={wrapperRef} className={drawerOpened ? 'drawer-opened' : ''}>
      {showFeedbackForm && <FeedbackForm variant="fishbowl" fishbowl={fishbowl} />}
      {feedbackAlert && (
        <div className="alert" data-testid="permission-alert">
          <PermissionsAlert />
        </div>
      )}
      <StyledButtonFeedback
        active={showFeedbackForm}
        disabled={disabled}
        onClick={handleOpenFeedback}
      >
        <Feedback />
        <span className="text medium">{t('feedback.buttonText')}</span>
        <span className="chevron">
          <Chevron />
        </span>
      </StyledButtonFeedback>
    </StyledFeedbackWrapper>
  );
};

export default ButtonFeedback;
