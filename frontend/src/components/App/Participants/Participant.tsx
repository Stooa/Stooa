/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import Link from 'next/link';

import { isCurrentGuest } from '@/lib/auth';
import { pushEventDataLayer } from '@/lib/analytics';

import Linkedin from '@/ui/svg/linkedin.svg';
import Twitter from '@/ui/svg/twitter.svg';
import Mic from '@/ui/svg/mic.svg';
import MicMuted from '@/ui/svg/mic-muted.svg';
import Video from '@/ui/svg/video.svg';
import VideoMuted from '@/ui/svg/video-muted.svg';
import { Participant } from '@/types/participant';

const ParticipantComponent: React.FC<{ participant: Participant; speaker?: boolean }> = ({
  participant,
  speaker = false
}) => {
  const { id, name, isModerator, twitter, linkedin, isCurrentUser, guestId } = participant;
  const isMyself = guestId ? isCurrentGuest(guestId) : isCurrentUser;

  return (
    <li className={`participant app-md`} data-id={id} title={name}>
      <div className="info">
        {speaker && (
          <>
            <Mic className="unmuted icon-small" />
            <MicMuted className="muted icon-small" />
            <Video className="video-unmuted icon-small" />
            <VideoMuted className="video-muted icon-small" />
          </>
        )}
        <span className="name">{name}</span>
        {(isModerator || isCurrentUser || isMyself) && (
          <span className="roles">
            ({isModerator && 'Host'}
            {isModerator && isMyself && ', '}
            {isMyself && 'Me'})
          </span>
        )}
      </div>
      <div className="social">
        {twitter ? (
          <Link href={twitter} passHref>
            <a
              onClick={() => {
                pushEventDataLayer({
                  action: 'Twitter',
                  category: 'Participants',
                  label: window.location.href
                });
              }}
              href={twitter}
              target="_blank"
              rel="noreferrer"
              className="icon"
            >
              <Twitter />
            </a>
          </Link>
        ) : (
          <span className="icon">
            <Twitter />
          </span>
        )}
        {linkedin ? (
          <Link href={linkedin} passHref>
            <a
              onClick={() => {
                pushEventDataLayer({
                  action: 'Linkedin',
                  category: 'Participants',
                  label: window.location.href
                });
              }}
              target="_blank"
              rel="noreferrer"
              className="icon"
            >
              <Linkedin />
            </a>
          </Link>
        ) : (
          <span className="icon">
            <Linkedin />
          </span>
        )}
      </div>
    </li>
  );
};

export default ParticipantComponent;
