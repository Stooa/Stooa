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

import { ROUTE_FISHBOWL } from '@/app.config';
import { getTimePlusOneMinute } from '@/lib/helpers';
import Layout from '@/layouts/Default';
import Loading from '@/components/App/Loader';

const HostNow = () => {
  const [createFishbowl] = useMutation(CREATE_FISHBOWL);
  const { lang, t } = useTranslation('fishbowl');
  const router = useRouter();

  const createFishbowlRequest = async () => {
    await createFishbowl({
      variables: {
        input: {
          name: '',
          description: '',
          startDateTime: getTimePlusOneMinute(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          duration: '01:00',
          locale: lang,
          isFishbowlNow: true
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
      });
  };

  useEffect(() => {
    createFishbowlRequest();
  }, []);

  return (
    <Layout>
      <Loading />
    </Layout>
  );
};

export default HostNow;
