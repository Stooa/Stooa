/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Layout from '@/layouts/Default';
import { useQuery } from '@apollo/client';
import { GET_SELF_USER } from '@/graphql/User';

const Slack = () => {
  const { data } = useQuery(GET_SELF_USER);
  const slackUrl = `https://slack.com/oauth/v2/authorize?scope=incoming-webhook&amp;user_scope=&redirect_uri=${process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL}&client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}`;
  const hasSlackWebHook = data && data.selfUser.slackWebHook;
  return (
    <Layout title="Slack">
      <h1 className="title-md form-title">Slack notifications</h1>
      <a className="body-md bold" href={slackUrl}>
        {hasSlackWebHook ? 'Update slack connection' : 'Add Slack connection'}
      </a>
      <br></br>
      {hasSlackWebHook && (
        <div>
          <b>Webhook:</b> {data.selfUser.slackWebHook}
        </div>
      )}
    </Layout>
  );
};

export default Slack;
