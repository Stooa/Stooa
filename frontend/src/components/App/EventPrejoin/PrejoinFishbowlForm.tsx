/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useAuth } from '@/contexts/AuthContext';
import { useStooa } from '@/contexts/StooaManager';
import { IConferenceStatus } from '@/jitsi/Status';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import AuthUser from './FormAuth';
import GuestForm from './Form';

export const PrejoinFishbowlForm = () => {
  const { isAuthenticated, user } = useAuth();
  const { data, isModerator, conferenceStatus } = useStooa();
  const { t } = useTranslation('common');

  return (
    <>
      <h2 data-testid="pre-join-title" className="title-md ">
        {isModerator && data.isFishbowlNow && conferenceStatus === IConferenceStatus.NOT_STARTED
          ? t('fishbowl:prejoin.startFishbowl')
          : t('fishbowl:prejoin.title')}
      </h2>
      <p className="body-md subtitle">
        {isModerator ? (
          t('fishbowl:prejoin.moderatorSubtitle')
        ) : (
          <Trans i18nKey="fishbowl:prejoin.subtitle" components={{ br: <br /> }} />
        )}
      </p>
      {isAuthenticated ? (
        <AuthUser isPrivate={data.isPrivate} name={user?.name ?? ''} />
      ) : (
        <GuestForm isPrivate={data.isPrivate} />
      )}
    </>
  );
};
