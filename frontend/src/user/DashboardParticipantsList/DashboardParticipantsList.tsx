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
import useTranslation from 'next-translate/useTranslation';
import { User } from '@/types/api-platform/interfaces/user';

interface Props {
  participants: Participant[];
  host: User | string;
}

const DashboardParticipantsList = ({ participants, host }: Props) => {
  const { t } = useTranslation('fishbowl-list');

  const generateParticipantName = (participant: Participant): string | undefined => {
    return host && participant.user && participant.user['@id'] === host['@id']
      ? `${participant?.user.name} ${participant?.user.surnames} ${t('me')}`
      : `${participant.user?.name} ${participant.user?.surnames}`;
  };
  return (
    <StyledListWrapper>
      {participants.map(participant => {
        return (
          <StyledParticipantItem
            key={participant['@id']}
            className={participant.user ? 'column' : ''}
          >
            {participant.user && <p className="body-sm medium">{generateParticipantName(participant)}</p>}
            {participant.guest && <p className="body-sm medium">{participant.guest.name}</p>}
            <div className="participant__contacts">
              <p className="body-sm">
                {participant.user ? participant.user.email : t('guestUser')}
              </p>
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
