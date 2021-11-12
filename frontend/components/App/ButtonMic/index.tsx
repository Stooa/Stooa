/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import { pushEventDataLayer } from 'lib/analytics';
import userRepository from '@/jitsi/User';
import MicMutedIcon from 'ui/svg/mic-muted.svg';
import MicIcon from 'ui/svg/mic.svg';
import Button from 'components/App/ButtonMic/styles';

interface Props {
  joined: boolean;
  disabled: boolean;
  unlabeled?: boolean;
  handleMic?: (value?: boolean) => void;
}

const ButtonMic: React.FC<Props> = ({ handleMic, joined, disabled, unlabeled }) => {
  const [active, setActive] = useState(true);
  const [muted, setMuted] = useState(userRepository.getUserAudioMuted());
  const { t } = useTranslation('fishbowl');

  const handleOnClick = async () => {
    const currentMutedState = muted;
    setActive(false);

    pushEventDataLayer({
      action: muted ? 'Unmute' : 'Mute',
      category: 'Buttons',
      label: window.location.href
    });

    userRepository.setUserAudioMuted(!currentMutedState);
    setMuted(!currentMutedState);
    typeof handleMic === 'function' && handleMic(!currentMutedState);
    setActive(true);
  };

  return (
    <Button
      className={`text-sm ${muted ? 'muted' : ''}`}
      onClick={handleOnClick}
      disabled={disabled}
      active={active}>
      <div className="button">{muted || disabled ? <MicMutedIcon /> : <MicIcon />}</div>
      {!unlabeled && (
        <span className="text medium">{!joined || muted ? t('unmute') : t('mute')}</span>
      )}
    </Button>
  );
};

export default ButtonMic;
