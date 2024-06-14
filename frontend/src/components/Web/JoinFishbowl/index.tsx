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

import { Fishbowl } from '@/types/api-platform';
import { ROUTE_FISHBOWL, ROUTE_SIGN_IN } from '@/app.config';
import { useStateValue } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { isTimeLessThanNMinutes } from '@/lib/helpers';

import Button from '@/components/Common/Button';
import RedirectLink from '@/components/Web/RedirectLink';
import { StyledJoinEventCta } from '@/ui/JoinEvent';

interface Props {
  data: Fishbowl;
  joinAsGuest?: () => void;
  isCreator?: boolean;
}

const MINUTE = 60 * 1000;
const MINUTES_TO_START_FISHBOWL = 60;

const JoinFishbowl = ({ data, joinAsGuest }: Props) => {
  const [{ fishbowlReady }, dispatch] = useStateValue();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('fishbowl');
  const intervalRef = useRef<number>();

  const fbRoute = `${ROUTE_FISHBOWL}/${data.slug}`;

  // TODO: CHANGE TO 1 TIMEOUT
  const evaluateFishbowlReady = () => {
    const isReady = isTimeLessThanNMinutes(data.startDateTimeTz, MINUTES_TO_START_FISHBOWL);

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

  return (
    <>
      <StyledJoinEventCta>
        {isAuthenticated && fishbowlReady && (
          <div className="join-buttons">
            <RedirectLink href={fbRoute} locale={data.locale} passHref>
              <Button size="large" variant="primary" as="a">
                {t('joinFishbowl')}
              </Button>
            </RedirectLink>
          </div>
        )}
        {!isAuthenticated && fishbowlReady && (
          <>
            <div className="join-buttons">
              <Button size="large" variant="primary" onClick={joinAsGuest}>
                {t('joinGuest')}
              </Button>
              <RedirectLink
                href={`${ROUTE_SIGN_IN}?redirect=${fbRoute}`}
                locale={data.locale}
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

export default JoinFishbowl;
