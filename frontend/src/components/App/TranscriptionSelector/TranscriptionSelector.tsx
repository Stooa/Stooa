/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useRef, useState } from 'react';
import LanguageTranscriptionSelector from '../LanguageTranscriptionSelector';
import { StyledTranscriptionWrapper } from './styles';
import InfoSVG from '@/ui/svg/info-brown.svg';
import ColoredFullTooltip from '@/components/Common/ColoredFullTooltip/ColoredFullTooltip';
import useTranslation from 'next-translate/useTranslation';
import { useUserAuth } from '@/user/auth/useUserAuth';
import { useConference } from '@/jitsi/useConference';
import { useTranscriptions } from '@/contexts/TranscriptionContext';

interface Props {
  tooltip?: boolean;
  location?: 'modal' | 'default';
}

const TranscriptionSelector = ({ tooltip, location }: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [arrowPosition, setArrowPosition] = useState<string>('');
  const tipToHover = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('fishbowl');
  const { getTranscriptionLanguageCookie, setTranscriptionLanguageCookie } = useUserAuth();
  const { setConferenceTranscriptionLanguage } = useConference();
  const { setSelectedTranscriptionLanguage } = useTranscriptions();

  const cookieTranscriptionLanguage = getTranscriptionLanguageCookie();

  const handleChangeTranscriptionLanguage = (locale: string): void => {
    setSelectedTranscriptionLanguage(locale);
    setConferenceTranscriptionLanguage(locale);
    setTranscriptionLanguageCookie(locale);
  };

  const handleOnMouseEnter: React.MouseEventHandler = () => {
    if (tipToHover.current) {
      const left = tipToHover.current.offsetLeft;
      setArrowPosition(left + 'px');
      setShowTooltip(true);
    }
  };

  return (
    <StyledTranscriptionWrapper location={location}>
      {tooltip && showTooltip && (
        <ColoredFullTooltip arrowPosition={arrowPosition} text={t('transcription.tooltip')} />
      )}

      <label>
        <p>{t('form:fishbowl.language')}</p>
        {tooltip && (
          <div
            ref={tipToHover}
            className="info"
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <InfoSVG />
          </div>
        )}
      </label>
      <LanguageTranscriptionSelector
        location={location}
        id="transcription-language"
        propsSelectedLanguage={cookieTranscriptionLanguage}
        changedLanguage={handleChangeTranscriptionLanguage}
      />
    </StyledTranscriptionWrapper>
  );
};

export default TranscriptionSelector;
