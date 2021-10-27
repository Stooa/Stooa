/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import { ROUTE_FISHBOWL, ROUTE_SIGN_IN } from 'app.config';
import { useStateValue } from 'contexts/AppContext';
import { useAuth } from 'contexts/AuthContext';
import { isTimeLessThanNMinutes } from 'lib/helpers';

import Button, { ButtonHollow } from 'ui/Button';
import { JoinFishbowlStyled } from 'components/Web/JoinFishbowl/styles';

interface IProps {
  data: any;
  joinAsGuest?: () => void;
  isCreator?: boolean;
}

const MINUTE = 60 * 1000;
const MINUTES_TO_START_FISHBOWL = 60;

const JoinFishbowl: React.FC<IProps> = ({ data, joinAsGuest }) => {
  const [{ fishbowlReady }, dispatch] = useStateValue();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('fishbowl');

  const fbRoute = `${ROUTE_FISHBOWL}/${data.slug}`;
  let intervalId;

  const evaluateFishbowlReady = () => {
    const isReady = isTimeLessThanNMinutes(data.startDateTimeTz, MINUTES_TO_START_FISHBOWL);

    if (isReady) {
      window.clearInterval(intervalId);

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

    intervalId = window.setInterval(evaluateFishbowlReady, MINUTE);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <>
      <JoinFishbowlStyled>
        {isAuthenticated && fishbowlReady && (
          <div className="join-buttons">
            <Link href={fbRoute} locale={data.locale}>
              <ButtonHollow as="a">{t('joinFishbowl')}</ButtonHollow>
            </Link>
          </div>
        )}
        {!isAuthenticated && fishbowlReady && (
          <>
            <div className="join-buttons">
              <Button onClick={joinAsGuest}>{t('joinGuest')}</Button>
              <Link href={`${ROUTE_SIGN_IN}?redirect=${fbRoute}`} locale={data.locale} passHref>
                <ButtonHollow as="a">{t('joinMember')}</ButtonHollow>
              </Link>
            </div>
            <p className="text-xxs">{t('joinMemberNote')}</p>
          </>
        )}
      </JoinFishbowlStyled>
    </>
  );
};

export default JoinFishbowl;
