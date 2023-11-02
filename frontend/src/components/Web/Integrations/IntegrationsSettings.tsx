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
import useTranslation from 'next-translate/useTranslation';

const IntegrationsPage = () => {
  const { t } = useTranslation('integrations');
  const { query, replace } = useRouter();

  const [syncedHubspot, setSyncedHubspot] = useState<boolean>();
  const [isSyncedStarted, setIsSyncedStarted] = useState(false);
  const [dateFromCallback, setDateFromCallback] = useState<string>();

  const [confirmSyncContactsModal, setConfirmSyncContactsModal] = useState(false);
  const [confirmUnsyncHubspot, setConfirmUnsyncHubspot] = useState(false);

  const { data } = useQuery(GET_SELF_USER, { pollInterval: 1000 });
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
    let data;
    try {
      data = await Hubspot.syncHubspotContacts();
    } catch (error) {
      data = error;
    }

    toast(t('integrationItems.hubspot.contactsSyncedSuccessfully'), {
      type: 'success',
      icon: '👌',
      position: 'bottom-center',
      autoClose: 5000
    });

    setIsSyncedStarted(true);
    setConfirmSyncContactsModal(false);
    setDateFromCallback(data.response);
  };

  useEffect(() => {
    if (!syncedHubspot && code) {
      createHubspotToken(code as string).then(() => {
        toast(t('integrationItems.hubspot.linkedSuccessfully'), {
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
    if (data?.selfUser.hasHubspotRefreshToken && !syncedHubspot) {
      setSyncedHubspot(true);
    }
  }, [data]);

  return (
    <LayoutWeb>
      <ToastContainer className="toastify-custom" />

      {confirmSyncContactsModal && (
        <ConfirmationModal
          closeModal={() => setConfirmSyncContactsModal(false)}
          actionText={t('integrationItems.hubspot.syncAction')}
          onSubmit={handleSyncContacts}
          title={t('integrationItems.hubspot.syncActionModalTitle')}
          body={t('integrationItems.hubspot.syncActionModalBody')}
        />
      )}

      {confirmUnsyncHubspot && (
        <ConfirmationModal
          closeModal={() => setConfirmUnsyncHubspot(false)}
          actionText={t('integrationItems.hubspot.unsync')}
          onSubmit={handleUnSync}
          title={t('integrationItems.hubspot.unsyncActionModalTitle')}
          body={t('integrationItems.hubspot.unsyncActionModalBody')}
        />
      )}

      <IntegrationsSettingsWrapper>
        <h1>{t('title')}</h1>
        <p className="subtitle">{t('subtitle')}</p>

        <StyledItemsWrapper>
          <IntegrationItem
            disabledSync={isSyncedStarted || !syncedHubspot}
            synced={syncedHubspot}
            syncUrl={hubspotUrl}
            onUnSync={() => setConfirmUnsyncHubspot(true)}
            onButtonAction={() => setConfirmSyncContactsModal(true)}
            lastSyncDate={dateFromCallback ?? data?.selfUser.lastSyncDate}
          >
            <HubspotLogo />
            <span>{t('integrationItems.hubspot.title')}</span>
          </IntegrationItem>
        </StyledItemsWrapper>
      </IntegrationsSettingsWrapper>
    </LayoutWeb>
  );
};

export default IntegrationsPage;
