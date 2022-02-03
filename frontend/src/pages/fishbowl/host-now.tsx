/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { CREATE_FISHBOWL } from '@/graphql/Fishbowl';
import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';

import { ROUTE_FISHBOWL, ROUTE_HOME } from '@/app.config';
import { getTimePlusOneMinute } from '@/lib/helpers';
import Layout from '@/layouts/Default';
import LoadingIcon from '@/components/Common/LoadingIcon';
import { useStateValue } from '@/contexts/AppContext';
import { IConferenceStatus } from '@/jitsi/Status';

const HostNow = () => {
  const [createFishbowl] = useMutation(CREATE_FISHBOWL);
  const [{}, dispatch] = useStateValue();
  const { lang } = useTranslation();
  const router = useRouter();

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleResetAppState = () => {
    dispatch({
      type: 'FISHBOWL_STATUS',
      fishbowlReady: false,
      fishbowlStarted: false,
      isGuest: false,
      prejoin: true,
      conferenceStatus: IConferenceStatus?.NOT_STARTED
    });
  };

  const createFishbowlRequest = async () => {
    await createFishbowl({
      variables: {
        input: {
          name: '',
          description: '',
          startDateTime: getTimePlusOneMinute(),
          timezone: timeZone,
          duration: '01:00',
          locale: lang,
          isFishbowlNow: true,
          hasIntroduction: false
        }
      }
    })
      .then(res => {
        const {
          data: {
            createFishbowl: { fishbowl }
          }
        } = res;
        console.log('[STOOA] Host now fishbowl created', fishbowl);
        const route = `${ROUTE_FISHBOWL}/${fishbowl.slug}`;
        router.push(route, route, { locale: lang });
      })
      .catch(error => {
        console.error('[STOOA] Host now fishbowl error', error);
        router.push(ROUTE_HOME, ROUTE_HOME, { locale: lang });
      });
  };

  useEffect(() => {
    handleResetAppState();
    createFishbowlRequest();
  }, []);

  return (
    <Layout>
      <LoadingIcon />
    </Layout>
  );
};

export default HostNow;
