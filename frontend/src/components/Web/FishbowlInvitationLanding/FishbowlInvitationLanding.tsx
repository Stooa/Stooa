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
  StyledInventationLandingContentBody,
  StyledMobileDataCard
} from './styles';
import FishbowlDataCard from '../FishbowlDataCard';
import Image from 'next/image';
import RegisterInvitation from '../Forms/RegisterInvitation';
import { isTimeLessThanNMinutes } from '@/lib/helpers';
import { useEffect, useRef, useState } from 'react';
import { useStateValue } from '@/contexts/AppContext';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';

const JoinFishbowl = dynamic(import('@/components/Web/JoinFishbowl'), { loading: () => <div /> });

interface Props {
  fishbowl: Fishbowl;
  handleJoinAsGuest: () => void;
}

const MINUTE = 60 * 1000;
const MINUTES_TO_START_FISHBOWL = 60;

const FishbowlInvitationLanding = ({ fishbowl, handleJoinAsGuest }: Props) => {
  const [sentRegistration, setSentRegistration] = useState(false);
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

  const onSubmit = () => {
    if (!sentRegistration) {
      setSentRegistration(true);
    }
  };

  useEffect(() => {
    evaluateFishbowlReady();

    intervalRef.current = window.setInterval(evaluateFishbowlReady, MINUTE);

    return () => window.clearInterval(intervalRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startDateTime = new Date(startDateTimeTz);

  const localFormatDate = new Intl.DateTimeFormat(lang, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(startDateTime);

  const pageTitle = `${invitationTitle} - ${host.name} ${host.surnames}`;

  return (
    <>
      <ToastContainer className="toastify-custom" />
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={fishbowl.invitationSubtitle} />
      </Head>
      <StyledInvitationLanding>
        <StyledInvitationContent>
          <StyledInvitationHero>
            <h1 data-testid="fishbowl-name" className="title-lg">
              {invitationTitle}
            </h1>
            <h2 className="title-md">{localFormatDate}</h2>
            {invitationSubtitle && <p className="title-sm">{invitationSubtitle}</p>}
            {host && (
              <p className="body-lg">
                {host.name} {host.surnames}
              </p>
            )}
            {fishbowlReady ? (
              <JoinFishbowl data={fishbowl} joinAsGuest={handleJoinAsGuest} />
            ) : (
              <a href="#form">
                <Button disabled={sentRegistration} as="a" size="large">
                  Me apunto
                </Button>
              </a>
            )}
          </StyledInvitationHero>
          <StyledMobileDataCard>
            <FishbowlDataCard data={fishbowl} />
          </StyledMobileDataCard>
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
            {sentRegistration && (
              <AnimatePresence>
                <motion.h3
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="title-sm"
                >
                  Te has apuntado al fishbowl correctamente
                </motion.h3>
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Image
                    src="/img/friends/dancing.png"
                    width={252}
                    height={277}
                    alt="Dancing friend"
                  />
                </motion.div>
              </AnimatePresence>
            )}

            {!sentRegistration && (
              <>
                <h3 className="title-sm">Apúntate al Fishbowl. ¡Es gratis!</h3>
                <RegisterInvitation onSubmit={onSubmit} fishbowl={fishbowl} />
              </>
            )}
          </StyledInvitationFormWrapper>
        </StyledInvitationContent>
        <StyledFixedFishbowlData>
          <FishbowlDataCard fromLanding data={fishbowl} />
        </StyledFixedFishbowlData>
      </StyledInvitationLanding>
    </>
  );
};

export default FishbowlInvitationLanding;
