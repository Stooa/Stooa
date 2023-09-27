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
import { useEffect, useState } from 'react';
import RedirectLink from '@/components/Web/RedirectLink';
import { ROUTE_FISHBOWL_CREATE } from '@/app.config';
import Button from '@/components/Common/Button';
import useTranslation from 'next-translate/useTranslation';

const Slack = () => {
  const { data } = useQuery(GET_SELF_USER);
  const slackUrl = `https://slack.com/oauth/v2/authorize?scope=incoming-webhook&amp;user_scope=&redirect_uri=${process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL}&client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}`;
  const [slackWebHook, setSlackWebHook] = useState<string>();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (data && data.selfUser.slackWebHook) {
      setSlackWebHook(data.selfUser.slackWebHook);
    }
  }, [data]);

  return (
    <Layout title="Slack">
      <h1 className="title-md form-title">Slack notifications</h1>
      <a className="body-md bold" href={slackUrl}>
        {slackWebHook ? 'Update slack connection' : 'Add Slack connection'}
      </a>
      <br></br>
      {slackWebHook && (
        <>
          <div>
            <b>Webhook:</b> {slackWebHook}
          </div>
          <br></br>
          <RedirectLink href={ROUTE_FISHBOWL_CREATE} passHref>
            <Button size="large" as="a" className="animate-item cta-create-fishbowl">
              <span>{t('scheduleFishbowl')}</span>
            </Button>
          </RedirectLink>
        </>
      )}
    </Layout>
  );
};

export default Slack;
