/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Conference from '@/jitsi/Conference';
import React, { useRef, useState } from 'react';
import LanguageTranscriptionSelector from '../LanguageTranscriptionSelector';
import { StyledTranscriptionWrapper } from './styles';
import InfoSVG from '@/ui/svg/info-brown.svg';
import { getTranscriptionLanguage, setTranscriptionLanguage } from '@/user/auth';
import ColoredFullTooltip from '@/components/Common/ColoredFullTooltip/ColoredFullTooltip';

interface Props {
  tooltip?: boolean;
  location?: 'modal' | 'sidebar';
}

const TranscriptionSelector = ({ tooltip, location }: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [arrowPosition, setArrowPosition] = useState<string>('');
  const tipToHover = useRef<HTMLDivElement>(null);

  const cookieTranscriptionLanguage = getTranscriptionLanguage();

  const handleChangeTranscriptionLanguage = (locale: string): void => {
    Conference.setTranscriptionLanguage(locale);
    setTranscriptionLanguage(locale);
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
        <ColoredFullTooltip
          arrowPosition={arrowPosition}
          text="what language are you talking bruv?"
        />
      )}

      <label>
        <p>Language</p>
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
        backgroundColor={location === 'modal' ? 'white' : 'transparent'}
        id="transcription-language"
        propsSelectedLanguage={cookieTranscriptionLanguage}
        changedLanguage={handleChangeTranscriptionLanguage}
      />
    </StyledTranscriptionWrapper>
  );
};

export default TranscriptionSelector;
