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

import Linkedin from '@/ui/svg/share-linkedin.svg';
import Twitter from '@/ui/svg/share-twitter.svg';
import { Participant } from '@/types/participant';
import ButtonContextMenu from '@/components/App/ButtonContextMenu';
import { StyledListItem } from './styles';

const ParticipantCard: React.FC<{
  participant: Participant;
  speaker?: boolean;
  variant?: 'prefishbowl' | 'participant-list';
}> = ({ participant, variant = 'participant-list' }) => {
  const { id, name, isModerator, twitter, linkedin, isCurrentUser, guestId } = participant;
  const isMyself = guestId ? isCurrentGuest(guestId) : isCurrentUser;

  return (
    <StyledListItem className={`participant ${variant}`} data-id={id} title={name}>
      <div className="info">
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
              data-username={`@${twitter.split('/').pop()}`}
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
              data-username={linkedin}
            >
              <Linkedin />
            </a>
          </Link>
        ) : (
          <span className="icon">
            <Linkedin />
          </span>
        )}
        <ButtonContextMenu initialParticipant={participant} />
      </div>
    </StyledListItem>
  );
};

export default ParticipantCard;
