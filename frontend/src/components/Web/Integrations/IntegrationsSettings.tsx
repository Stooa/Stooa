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
import ConfirmationModal from '@/components/Common/ConfirmationModal';

const IntegrationsPage = () => {
  const { query, replace } = useRouter();

  const [syncedHubspot, setSyncedHubspot] = useState<boolean>();
  const [isSyncedStarted, setIsSyncedStarted] = useState(false);
  const [confirmSyncContactsModal, setConfirmSyncContactsModal] = useState(false);
  const [confirmUnsyncHubspot, setConfirmUnsyncHubspot] = useState(false);

  const { data } = useQuery(GET_SELF_USER);
  const { createHubspotToken } = useUserAuth();

  const hubspotUrl = `${process.env.NEXT_PUBLIC_HUBSPOT_URL}?client_id=${
    process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID
  }&redirect_uri=${
    process.env.NEXT_PUBLIC_APP_DOMAIN + ROUTE_INTEGRATIONS
  }&scope=crm.objects.contacts.read%20crm.objects.contacts.write`;

  const { code } = query;

  const handleUnSync = () => {
    Hubspot.removeHubspotSync();
    setConfirmUnsyncHubspot(false);
    setSyncedHubspot(false);
  };

  const handleSyncContacts = async () => {
    await Hubspot.syncHubspotContacts();
    setIsSyncedStarted(true);
    setConfirmSyncContactsModal(false);
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

      {confirmSyncContactsModal && (
        <ConfirmationModal
          closeModal={() => setConfirmSyncContactsModal(false)}
          actionText="Sync contacts"
          onSubmit={handleSyncContacts}
          title="Are you sure you want to sync your contactts with hubspot?"
          body="Se sincronizaran todos los contactos de los participantes que hayan asistido a un Fishbowl organizado por ti."
        />
      )}

      {confirmUnsyncHubspot && (
        <ConfirmationModal
          closeModal={() => setConfirmUnsyncHubspot(false)}
          actionText="Unsync"
          onSubmit={handleUnSync}
          title="Are you sure you want to unsync your hubspot account?"
          body="Se eliminará la sincronización con hubspot y no podrás volver a sincronizar tu cuenta."
        />
      )}

      <IntegrationsSettingsWrapper>
        <h1>Integrations</h1>
        <p>You can sync your Stooa account with other applications and services</p>

        <StyledItemsWrapper>
          <IntegrationItem
            disabledSync={isSyncedStarted || data?.selfUser.lastSyncDate !== null}
            synced={syncedHubspot}
            syncUrl={hubspotUrl}
            onUnSync={() => setConfirmUnsyncHubspot(true)}
            onButtonAction={() => setConfirmSyncContactsModal(true)}
            lastSyncDate={data?.selfUser.lastSyncDate}
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
