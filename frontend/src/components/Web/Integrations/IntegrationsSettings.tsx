/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import LayoutWeb from '@/layouts/FishbowlDetail';
import { IntegrationsSettingsWrapper, StyledItemsWrapper } from './styles';
import { IntegrationItem } from './IntegrationItem';
import HubspotLogo from '@/ui/svg/hubspot.svg';
import { useQuery } from '@apollo/client';
import { GET_SELF_USER } from '@/graphql/User';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUserAuth } from '@/user/auth/useUserAuth';
import { ROUTE_HUBSPOT_RETURN } from '@/app.config';

const IntegrationsPage = () => {
  const { query } = useRouter();

  const { data } = useQuery(GET_SELF_USER);
  const { createHubspotToken } = useUserAuth();

  const hubspotUrl = `${process.env.NEXT_PUBLIC_HUBSPOT_URL}?client_id=${
    process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID
  }&redirect_uri=${
    process.env.NEXT_PUBLIC_APP_DOMAIN + ROUTE_HUBSPOT_RETURN
  }&scope=crm.objects.contacts.read%20crm.objects.contacts.write`;

  const { code } = query;

  useEffect(() => {
    if (code) {
      createHubspotToken(code as string);
    }
  }, [code, createHubspotToken]);

  return (
    <LayoutWeb>
      <IntegrationsSettingsWrapper>
        <h1>Integrations</h1>
        <p>You can sync your Stooa account with other applications and services</p>

        <StyledItemsWrapper>
          <IntegrationItem
            synced={data?.selfUser.hasHubspotRefreshToken || false}
            unsyncUrl="emptyfornow?"
            syncUrl={hubspotUrl}
          >
            <HubspotLogo />
            <span>Hubspot</span>
          </IntegrationItem>
        </StyledItemsWrapper>
      </IntegrationsSettingsWrapper>
    </LayoutWeb>
  );
};

export default IntegrationsPage;
