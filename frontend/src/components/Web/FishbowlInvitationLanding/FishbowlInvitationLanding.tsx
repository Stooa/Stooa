/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import dynamic from 'next/dynamic';
import Button from '@/components/Common/Button';
import { Fishbowl } from '@/types/api-platform';
import useTranslation from 'next-translate/useTranslation';
import {
  StyledInvitationHero,
  StyledInvitationContent,
  StyledInvitationLanding,
  StyledFixedFishbowlData,
  StyledInvitationFormWrapper,
  StyledInventationLandingContentBody
} from './styles';
import FishbowlDataCard from '../FishbowlDataCard';
import Image from 'next/image';
import RegisterInvitation from '../Forms/RegisterInvitation';
import { isTimeLessThanNMinutes } from '@/lib/helpers';
import { useEffect, useRef } from 'react';
import { useStateValue } from '@/contexts/AppContext';

const JoinFishbowl = dynamic(import('@/components/Web/JoinFishbowl'), { loading: () => <div /> });

interface Props {
  fishbowl: Fishbowl;
  handleJoinAsGuest: () => void;
}

const MINUTE = 60 * 1000;
const MINUTES_TO_START_FISHBOWL = 60;

const FishbowlInvitationLanding = ({ fishbowl, handleJoinAsGuest }: Props) => {
  const [{ fishbowlReady }, dispatch] = useStateValue();
  const { invitationTitle, invitationSubtitle, invitationText, startDateTimeTz, host } = fishbowl;
  const { lang } = useTranslation();
  const intervalRef = useRef<number>();

  const evaluateFishbowlReady = () => {
    const isReady = isTimeLessThanNMinutes(fishbowl.startDateTimeTz, MINUTES_TO_START_FISHBOWL);

    if (isReady) {
      window.clearInterval(intervalRef.current);

      dispatch({
        type: 'FISHBOWL_READY',
        fishbowlReady: true
      });
    } else {
      console.log('[STOOA] More than 1 hour to start fishbowl');
    }
  };

  useEffect(() => {
    evaluateFishbowlReady();

    intervalRef.current = window.setInterval(evaluateFishbowlReady, MINUTE);

    return () => window.clearInterval(intervalRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  console.log('RAMONEIRO', fishbowl);

  const startDateTime = new Date(startDateTimeTz);

  const localFormatDate = new Intl.DateTimeFormat(lang, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(startDateTime);

  return (
    <StyledInvitationLanding>
      <StyledInvitationContent>
        <StyledInvitationHero>
          <h1 className="title-lg">{invitationTitle}</h1>
          <h2 className="title-md">{localFormatDate}</h2>
          {invitationSubtitle && <p>{invitationSubtitle}</p>}
          {host && (
            <p className="body-lg">
              {host.name} {host.surnames}
            </p>
          )}
          {fishbowlReady ? (
            <JoinFishbowl data={fishbowl} joinAsGuest={handleJoinAsGuest} />
          ) : (
            <a href="#form">
              <Button as="a" size="large">
                Me apunto
              </Button>
            </a>
          )}
        </StyledInvitationHero>

        <div className="fishbowl-preview">
          <Image
            src="/img/web/stooa-preview.png"
            priority
            alt="Stooa fishbowl event"
            width={720}
            height={448}
          />
        </div>

        <StyledInventationLandingContentBody
          dangerouslySetInnerHTML={{ __html: invitationText ?? '' }}
        ></StyledInventationLandingContentBody>

        <StyledInvitationFormWrapper id="form">
          <h3 className="title-sm">Apúntate al Fishbowl. ¡Es gratis!</h3>
          <RegisterInvitation fishbowl={fishbowl} />
        </StyledInvitationFormWrapper>
      </StyledInvitationContent>
      <StyledFixedFishbowlData>
        <FishbowlDataCard data={fishbowl} />
      </StyledFixedFishbowlData>
    </StyledInvitationLanding>
  );
};

export default FishbowlInvitationLanding;
