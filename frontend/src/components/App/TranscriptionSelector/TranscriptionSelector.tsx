/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Conference from '@/jitsi/Conference';
import { useState } from 'react';
import LanguageTranscriptionSelector from '../LanguageTranscriptionSelector';
import { StyledTranscriptionWrapper } from './styles';
import InfoSVG from '@/ui/svg/info-brown.svg';
import Tooltip from '@/components/Common/Tooltip/Tooltip';

interface Props {
  tooltip?: boolean;
}

const TranscriptionSelector = ({ tooltip }: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChangeTranscriptionLanguage = (locale: string): void => {
    Conference.setTranscriptionLanguage(locale);
  };

  return (
    <StyledTranscriptionWrapper>
      <label>
        <p>Language</p>
        <span
          className="info"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <InfoSVG />
          {tooltip && (
            <Tooltip showTooltip={showTooltip} position="top" arrow={true}>
              <p>
                Select the language
                <br />
                you are talking
              </p>
            </Tooltip>
          )}
        </span>
      </label>
      <LanguageTranscriptionSelector
        id="transcription-language"
        changedLanguage={handleChangeTranscriptionLanguage}
      />
    </StyledTranscriptionWrapper>
  );
};

export default TranscriptionSelector;
