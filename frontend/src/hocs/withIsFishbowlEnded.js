/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

import { ROUTE_FISHBOWL_THANKYOU } from '@/app.config';
import api from '@/lib/api';
import { IConferenceStatus } from '@/jitsi/Status';
import Loader from '@/components/Web/Loader';
import Error from '@/components/Common/Error';
import { useStateValue } from '@/contexts/AppContext';

const withIsFishbowlEnded = WrappedComponent => props => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [, dispatch] = useStateValue();
  const router = useRouter();
  const { lang } = useTranslation();
  const { fid } = router.query;

  useEffect(() => {
    api
      .get(`${lang}/fishbowl-status/${fid}`, {
        headers: { 'Accept-Language': lang }
      })
      .then(({ data }) => {
        dispatch({
          type: 'FISHBOWL_STATUS',
          conferenceStatus: data.status
        });

        if (data.status === IConferenceStatus.FINISHED) {
          console.log('[STOOA] Finished fishbowl. redirecting to thankyou page');
          const route = `${ROUTE_FISHBOWL_THANKYOU}/${fid}`;
          router.push(route, route, { locale: lang });
        } else {
          setLoaded(true);
        }
      })
      .catch(error => {
        console.log('[STOOA] ', error);
        setError(true);
      });
  }, []);

  // if (!loaded) return <Loader />;
  // if (error) return <Error message={error.message} />;

  return <WrappedComponent {...props} />;
};

export default withIsFishbowlEnded;
