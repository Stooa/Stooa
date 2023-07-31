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

import { useUserAuth } from '@/user/auth/useUserAuth';
import { pushEventDataLayer } from '@/lib/analytics';

import Linkedin from '@/ui/svg/share-linkedin.svg';
import Twitter from '@/ui/svg/share-twitter.svg';
import { Participant } from '@/types/participant';
import ButtonContextMenu from '@/components/App/ButtonContextMenu';
import { StyledListItem } from './styles';
import { getLinkedinUsername, getTwitterUsername } from '@/lib/Validators/SocialNetworkValidators';

const ParticipantCard: React.FC<{
  participant: Participant;
  speaker?: boolean;
  prefishbowl?: boolean;
}> = ({ participant, prefishbowl = false }) => {
  const { isCurrentGuest } = useUserAuth();
  const { id, name, isModerator, twitter, linkedin, isCurrentUser, guestId } = participant;
  const isMyself = guestId ? isCurrentGuest(guestId) : isCurrentUser;

  const twitterUsername = getTwitterUsername(twitter);
  const linkedinUsername = getLinkedinUsername(linkedin);

  return (
    <StyledListItem
      className={`participant ${prefishbowl ? 'prefishbowl' : ''}`}
      data-id={id}
      title={name}
    >
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
          <Link
            href={twitter}
            onClick={() => {
              pushEventDataLayer({
                action: 'Twitter',
                category: prefishbowl ? 'Prefishbowl' : 'Participants',
                label: window.location.href
              });
            }}
            target="_blank"
            rel="noreferrer"
            className={`icon ${twitterUsername ? 'twitter' : 'invalid'}`}
            data-username={`@${twitterUsername}`}
          >
            <Twitter />
          </Link>
        ) : (
          <span className="icon">
            <Twitter />
          </span>
        )}
        {linkedin ? (
          <Link
            href={linkedin}
            onClick={() => {
              pushEventDataLayer({
                action: 'Linkedin',
                category: prefishbowl ? 'Prefishbowl' : 'Participants',
                label: window.location.href
              });
            }}
            target="_blank"
            rel="noreferrer"
            className={`icon ${linkedinUsername ? 'linkedin' : 'invalid'}`}
            data-username={linkedinUsername}
          >
            <Linkedin />
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
