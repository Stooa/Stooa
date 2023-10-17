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
import { useMutation, useQuery } from '@apollo/client';
import { GET_SELF_USER, UPDATE_USER } from '@/graphql/User';
const HubspotReturn = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [response, setResponse] = useState('');
  const { data } = useQuery(GET_SELF_USER);
  const [updateUser] = useMutation(UPDATE_USER);

  useEffect(() => {
    if (data) {
      updateUser({
        variables: {
          input: {
            id: data.selfUser.id,
            hubspotCode: urlParams.get('code')
          }
        }
      })
        .then(async res => {
          console.log('res', res);
          setResponse(res.data.updateUser.user.hubspotCode);
        })
        .catch(error => {
          console.log('error', error);
        });
    }
  }, [data]);

  return (
    <Layout title="Hubspot connection established">
      <h1 className="title-md form-title">Hubspot connection established</h1>
      <p>Hubspot Code: {response}</p>
      <a href={ROUTE_HUBSPOT} className="item">
        <span className="body-md bold">Click to return to Hubspot</span>
      </a>
    </Layout>
  );
};

export default HubspotReturn;
