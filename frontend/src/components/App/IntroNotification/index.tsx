/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';
import { StyledIntroNotification } from './styles';
import Cross from '@/ui/svg/cross.svg';
import useTranslation from 'next-translate/useTranslation';

const IntroNotification = () => {
  const [showIntroNotification, setShowIntroNotification] = useState(true);
  const { t } = useTranslation('app');

  if (showIntroNotification) {
    return (
      <StyledIntroNotification>
        {t('notification.joinAfterIntroduction')}
        <button className="cross" onClick={() => setShowIntroNotification(false)}>
          <Cross />
        </button>
      </StyledIntroNotification>
    );
  } else {
    return null;
  }
};

export default IntroNotification;
