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

import { pushEventDataLayer } from '@/lib/analytics';
import VideoIcon from '@/ui/svg/video.svg';
import VideoMutedIcon from '@/ui/svg/video-muted.svg';
import Button from '@/components/App/ButtonVideo/styles';
import { useUser } from '@/jitsi';

interface Props {
  joined: boolean;
  disabled: boolean;
  unlabeled?: boolean;
  handleVideo?: (value?: boolean) => void;
}

const ButtonVideo: React.FC<Props> = ({ handleVideo, joined, disabled, unlabeled }) => {
  const { getUserVideoMuted, setUserVideoMuted } = useUser();
  const [active, setActive] = useState(true);
  const [muted, setMuted] = useState(getUserVideoMuted());
  const { t } = useTranslation('fishbowl');

  const handleOnClick = async () => {
    const currentMutedState = muted;
    setActive(false);

    pushEventDataLayer({
      action: muted ? 'Video Unmute' : 'Video Mute',
      category: 'Buttons',
      label: window.location.href
    });

    setUserVideoMuted(!currentMutedState);
    setMuted(!currentMutedState);
    typeof handleVideo === 'function' && handleVideo(!currentMutedState);
    setActive(true);
  };

  return (
    <Button
      className={`body-sm ${muted ? 'muted' : ''}`}
      onClick={handleOnClick}
      disabled={disabled}
      active={active}
    >
      <div className="button">{muted || disabled ? <VideoMutedIcon /> : <VideoIcon />}</div>
      {!unlabeled && (
        <div className="text medium">{!joined || muted ? t('videoUnmute') : t('videoMute')}</div>
      )}
    </Button>
  );
};

export default ButtonVideo;
