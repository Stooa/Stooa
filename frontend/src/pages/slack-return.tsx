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
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_SELF_USER, UPDATE_USER } from '@/graphql/User';
import Link from 'next/link';
import { ROUTE_SLACK } from '@/app.config';
const Slack = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [response, setResponse] = useState('');
  const [updateUser] = useMutation(UPDATE_USER);
  const { data } = useQuery(GET_SELF_USER);

  useEffect(() => {
    if (data) {
      axios
        .post(
          'https://slack.com/api/oauth.v2.access',
          {
            client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_SLACK_CLIENT_SECRET,
            code: urlParams.get('code'),
            redirect_uri: 'https://localhost:8343/slack-return'
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )
        .then(async function (response) {
          console.log('[Stooa] slack api response', response)

          await updateUser({
            variables: {
              input: {
                id: data.selfUser.id,
                slackWebHook: response.data.incoming_webhook.url
              }
            }
          })
            .then(async res => {
              console.log('res', res);
            })
            .catch(error => {
              console.log('error', error);
            });
          setResponse(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [data]);

  return (
    <Layout title="Slack connection established">
      <h1 className="title-md form-title">Slack connection established</h1>
      <p>{response}</p>
      <Link href={ROUTE_SLACK} className="item">
        <span className="body-md bold">Click to return to Slack notifications</span>
      </Link>
    </Layout>
  );
};

export default Slack;
