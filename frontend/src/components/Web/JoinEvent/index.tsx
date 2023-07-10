/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useRef } from 'react';
import useTranslation from 'next-translate/useTranslation';

import { ROUTE_FISHBOWL, ROUTE_SIGN_IN, ROUTE_WORLD_CAFE } from '@/app.config';
import { useAuth } from '@/contexts/AuthContext';
import { isTimeLessThanNMinutes } from '@/lib/helpers';

import Button from '@/components/Common/Button';
import RedirectLink from '@/components/Web/RedirectLink';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';
import { StyledJoinEventCta } from '@/ui/JoinEvent';

interface Props {
  joinAsGuest?: () => void;
  isCreator?: boolean;
}

const MINUTE = 60 * 1000;
const MINUTES_TO_START_EVENT = 60;

const JoinEvent = ({ joinAsGuest }: Props) => {
  const { setWorldCafeReady, worldCafeReady, worldCafe } = useWorldCafeStore(state => ({
    setWorldCafeReady: state.setWorldCafeReady,
    worldCafeReady: state.isReady,
    worldCafe: state.worldCafe
  }));
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('fishbowl');
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (!worldCafe) {
      return;
    }
    evaluateEventReady();

    intervalRef.current = window.setInterval(evaluateEventReady, MINUTE);

    return () => window.clearInterval(intervalRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!worldCafe) {
    return null;
  }

  const fbRoute = `${ROUTE_WORLD_CAFE}/${worldCafe.slug}`;

  const evaluateEventReady = () => {
    let isReady = false;
    if (worldCafe.startDateTimeTz) {
      isReady = isTimeLessThanNMinutes(worldCafe.startDateTimeTz, MINUTES_TO_START_EVENT);
    }

    if (isReady) {
      setWorldCafeReady(true);
      window.clearInterval(intervalRef.current);
    } else {
      console.log('[STOOA] More than 1 hour to start fishbowl');
    }
  };

  return (
    <>
      <StyledJoinEventCta>
        {isAuthenticated && worldCafeReady && (
          <div className="join-buttons">
            <RedirectLink href={fbRoute} locale={worldCafe.locale} passHref>
              <Button size="large" variant="primary" as="a">
                {t('joinFishbowl')}
              </Button>
            </RedirectLink>
          </div>
        )}
        {!isAuthenticated && worldCafeReady && (
          <>
            <div className="join-buttons">
              <Button size="large" variant="primary" onClick={joinAsGuest}>
                {t('joinGuest')}
              </Button>
              <RedirectLink
                href={`${ROUTE_SIGN_IN}?redirect=${fbRoute}`}
                locale={worldCafe.locale}
                passHref
              >
                <Button size="large" variant="secondary" as="a">
                  {t('joinMember')}
                </Button>
              </RedirectLink>
            </div>
            <p className="body-xs">{t('joinMemberNote')}</p>
          </>
        )}
      </StyledJoinEventCta>
    </>
  );
};

export default JoinEvent;
