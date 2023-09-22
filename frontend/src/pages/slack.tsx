/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';


import Layout from '@/layouts/Default';

const Slack = () => {
  return (
    <Layout title='Slack'>
      <h1 className="title-md form-title">Slack</h1>
      <a href="https://slack.com/oauth/v2/authorize?scope=incoming-webhook&amp;user_scope=&amp;redirect_uri=https%3A%2F%2Flocalhost:8343/slack-return&amp;client_id=2400777561.5915959351270">Add to Slack</a>
    </Layout>
  );
};

export default Slack;
