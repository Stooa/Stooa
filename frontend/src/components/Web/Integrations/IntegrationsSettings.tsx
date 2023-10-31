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
import { useEffect, useState } from 'react';
import { useUserAuth } from '@/user/auth/useUserAuth';
import { ROUTE_INTEGRATIONS } from '@/app.config';
import Hubspot from '@/lib/Integrations/Hubspot';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const IntegrationsPage = () => {
  const { query, replace } = useRouter();

  const { data } = useQuery(GET_SELF_USER);
  const [syncedHubspot, setSyncedHubspot] = useState<boolean>();
  const { createHubspotToken } = useUserAuth();

  const hubspotUrl = `${process.env.NEXT_PUBLIC_HUBSPOT_URL}?client_id=${
    process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID
  }&redirect_uri=${
    process.env.NEXT_PUBLIC_APP_DOMAIN + ROUTE_INTEGRATIONS
  }&scope=crm.objects.contacts.read%20crm.objects.contacts.write`;

  const { code } = query;

  const handleUnSync = () => {
    Hubspot.removeHubspotSync();
    setSyncedHubspot(false);
  };

  useEffect(() => {
    if (!syncedHubspot && code) {
      console.log('code', code);
      createHubspotToken(code as string).then(() => {
        toast('Hubspot synced successfully', {
          type: 'success',
          icon: '👌',
          position: 'bottom-center',
          autoClose: 5000
        });
      });
      replace('/integrations');
      setSyncedHubspot(true);
    }
  }, [code, createHubspotToken, syncedHubspot]);

  useEffect(() => {
    if (data?.selfUser.hasHubspotRefreshToken) {
      setSyncedHubspot(true);
    }
  }, [data]);

  console.log(data);

  return (
    <LayoutWeb>
      <ToastContainer className="toastify-custom" />
      <IntegrationsSettingsWrapper>
        <h1>Integrations</h1>
        <p>You can sync your Stooa account with other applications and services</p>

        <StyledItemsWrapper>
          <IntegrationItem synced={syncedHubspot} syncUrl={hubspotUrl} onUnSync={handleUnSync}>
            <HubspotLogo />
            <span>Hubspot</span>
          </IntegrationItem>
        </StyledItemsWrapper>
      </IntegrationsSettingsWrapper>
    </LayoutWeb>
  );
};

export default IntegrationsPage;
