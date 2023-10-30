/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Layout from '@/layouts/Default';
import { ROUTE_HUBSPOT } from '@/app.config';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SELF_USER } from '@/graphql/User';
import { useUserAuth } from '@/user/auth/useUserAuth';

const HubspotReturn = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [response, setResponse] = useState<string | null>('');
  const { data } = useQuery(GET_SELF_USER);
  const { createHubspotToken } = useUserAuth();

  useEffect(() => {
    if (data) {
      createHubspotToken(urlParams.get('code'));
      setResponse(urlParams.get('code'));
    }
  }, [data]);

  return (
    <Layout title="Hubspot connection established">
      <h1 className="title-md form-title">Hubspot connection established</h1>
      <p>
        <b>Hubspot Code:</b> {response}
      </p>
      <p>
        <b>
          {data?.selfUser.hasHubspotRefreshToken ? 'Tiene Refresh token' : 'No tiene Refresh Token'}
        </b>
      </p>
      <a href={ROUTE_HUBSPOT} className="item">
        <span className="body-md bold">Click to return to Hubspot</span>
      </a>
    </Layout>
  );
};

export default HubspotReturn;
