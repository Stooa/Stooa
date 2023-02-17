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

const ButtonFeedback = ({ drawerOpened = false }) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const handleOpenFeedback = () => {
    setShowFeedbackForm(!showFeedbackForm);
  };

  return (
    <StyledFeedbackWrapper className={drawerOpened ? 'drawer-opened' : ''}>
      {showFeedbackForm && <FeedbackForm />}
      <StyledButtonFeedback onClick={handleOpenFeedback}>BUTT</StyledButtonFeedback>
    </StyledFeedbackWrapper>
  );
};

export default ButtonFeedback;
