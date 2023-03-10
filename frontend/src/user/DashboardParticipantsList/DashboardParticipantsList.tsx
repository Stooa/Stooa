/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StyledListWrapper, StyledParticipantItem } from './styles';

import { Participant } from '@/types/api-platform/interfaces/participant';
import Twitter from '@/ui/svg/twitter.svg';
import Linkedin from '@/ui/svg/linkedin.svg';

interface Props {
  participants: Participant[];
}

const DashboardParticipantsList = ({ participants }: Props) => {
  return (
    <StyledListWrapper>
      {participants.map(participant => {
        console.log(participant);
        return (
          <StyledParticipantItem
            key={participant['@id']}
            className={participant.user ? 'column' : ''}
          >
            {participant.user && <p className="body-sm medium">{participant.user.name}</p>}
            {participant.guest && <p className="body-sm medium">{participant.guest.name}</p>}
            <div className="participant__contacts">
              <p className="body-sm">{participant.user && participant.user.email}</p>
              <div className="participant__socials ">
                <a
                  href={`${participant.user?.twitterProfile || ''}`}
                  target="_blank"
                  rel="noreferrer"
                  className={!participant.user?.twitterProfile ? 'disabled' : ''}
                >
                  <Twitter />
                </a>
                <a
                  href={`${participant.user?.linkedinProfile || ''}`}
                  target="_blank"
                  rel="noreferrer"
                  className={!participant.user?.linkedinProfile ? 'disabled' : ''}
                >
                  <Linkedin />
                </a>
              </div>
            </div>
          </StyledParticipantItem>
        );
      })}
    </StyledListWrapper>
  );
};

export default DashboardParticipantsList;
