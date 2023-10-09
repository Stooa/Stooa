/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';

import { Fishbowl } from '@/types/api-platform';
import { ROUTE_FISHBOWL, ROUTE_SIGN_IN } from '@/app.config';
import { useStateValue } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';

import { JoinFishbowlStyled } from '@/components/Web/JoinFishbowl/styles';
import Button from '@/components/Common/Button';
import RedirectLink from '@/components/Web/RedirectLink';

interface Props {
  data: Fishbowl;
  joinAsGuest?: () => void;
  isCreator?: boolean;
}

const JoinFishbowl = ({ data, joinAsGuest }: Props) => {
  const [{ fishbowlReady }] = useStateValue();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('fishbowl');

  const fbRoute = `${ROUTE_FISHBOWL}/${data.slug}`;

  return (
    <>
      <JoinFishbowlStyled>
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
      </JoinFishbowlStyled>
    </>
  );
};

export default JoinFishbowl;
