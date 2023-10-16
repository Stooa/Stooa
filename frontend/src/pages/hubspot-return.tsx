/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Layout from '@/layouts/Default';
import axios from 'axios';
import {ROUTE_HUBSPOT} from '@/app.config';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SELF_USER } from '@/graphql/User';
const HubspotReturn = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [response, setResponse] = useState('');
  const { data } = useQuery(GET_SELF_USER);

  useEffect(() => {
    if (data) {
      axios
        .post(
          'https://api.hubapi.com/oauth/v1/token',
          {
            grant_type: 'authorization_code',
            client_id: process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_SECRET,
            redirect_uri: process.env.NEXT_PUBLIC_HUBSPOT_REDIRECT_URL,
            code: urlParams.get('code')
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
        .then(async function (response) {
          console.log('[Stooa] Hubspot api response', response);

          setResponse(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [data]);

  return (
    <Layout title="Hubspot connection established">
      <h1 className="title-md form-title">Hubspot connection established</h1>
      <p>{response}</p>
      <a href={ROUTE_HUBSPOT} className="item">
        <span className="body-md bold">Click to return to Hubspot</span>
      </a>
    </Layout>
  );
};

export default HubspotReturn;
