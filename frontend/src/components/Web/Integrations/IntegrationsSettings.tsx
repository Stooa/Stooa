/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';
import { IntegrationsSettingsWrapper, StyledItemsWrapper } from './styles';

import LayoutWeb from '@/layouts/FishbowlDetail';
import axios from 'axios';
import { IntegrationItem } from './IntegrationItem';
import { useQuery } from '@apollo/client';
import { GET_SELF_USER } from '@/graphql/User';
import { useRouter } from 'next/router';
import { useUserAuth } from '@/user/auth/useUserAuth';
import { ROUTE_INTEGRATIONS } from '@/app.config';
import Hubspot from '@/lib/Integrations/Hubspot';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import ConfirmationModal from '@/components/Common/ConfirmationModal';
import useTranslation from 'next-translate/useTranslation';

import HubspotLogo from '@/ui/svg/hubspot.svg';
import SlackLogo from '@/ui/svg/slack-logo.svg';

const IntegrationsPage = () => {
  const { t } = useTranslation('integrations');
  const { query, replace } = useRouter();

  const [syncedHubspot, setSyncedHubspot] = useState<boolean>();
  const [isSyncedStarted, setIsSyncedStarted] = useState(false);
  const [dateFromCallback, setDateFromCallback] = useState<string>();

  const [confirmSyncContactsModal, setConfirmSyncContactsModal] = useState(false);
  const [confirmUnsyncHubspot, setConfirmUnsyncHubspot] = useState(false);
  const [confirmUnsyncSlack, setConfirmUnsyncSlack] = useState(false);

  const slackUrl = `https://slack.com/oauth/v2/authorize?scope=incoming-webhook&amp;user_scope=&redirect_uri=${process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL}&client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}`;

  const { data } = useQuery(GET_SELF_USER, { pollInterval: 1000 });
  const { createHubspotToken, createSlackWebHook } = useUserAuth();
  const [syncedSlack, setSyncedSlack] = useState<boolean>(data?.selfUser.slackWebHook);

  const hubspotUrl = `${process.env.NEXT_PUBLIC_HUBSPOT_URL}?client_id=${
    process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID
  }&redirect_uri=${
    process.env.NEXT_PUBLIC_APP_DOMAIN + ROUTE_INTEGRATIONS
  }&scope=crm.objects.contacts.read%20crm.objects.contacts.write`;

  const { code, state } = query;

  const handleHubspotUnsync = () => {
    Hubspot.removeHubspotSync();
    setConfirmUnsyncHubspot(false);
    setSyncedHubspot(false);
  };

  const handleSlackUnsync = () => {
    setConfirmUnsyncSlack(false);
    setSyncedSlack(false);
    createSlackWebHook('');
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
    if (!syncedHubspot && code && state === undefined) {
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

    if (!syncedSlack && code && state !== undefined) {
      axios
        .post(
          'https://slack.com/api/oauth.v2.access',
          {
            client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_SLACK_CLIENT_SECRET,
            code: code,
            redirect_uri: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )
        .then(async function (response) {
          console.log('[Stooa] slack api response', response);

          if (response.data.incoming_webhook) {
            createSlackWebHook(response.data.incoming_webhook.url).then(() => {
              toast(t('integrationItems.slack.linkedSuccessfully'), {
                type: 'success',
                icon: '👌',
                position: 'bottom-center',
                autoClose: 5000
              });
            });
          } else {
            toast(t('integrationItems.slack.notSuccessfully'), {
              type: 'error',
              icon: '👎',
              position: 'bottom-center',
              autoClose: 5000
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });

      replace('/integrations');
    }
  }, [code, createHubspotToken, syncedHubspot, syncedSlack, state]);

  useEffect(() => {
    if (data?.selfUser.hasHubspotRefreshToken && !syncedHubspot) {
      setSyncedHubspot(true);
    }

    if (data?.selfUser.slackWebHook && !syncedSlack) {
      setSyncedSlack(true);
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
          onSubmit={handleHubspotUnsync}
          title={t('integrationItems.hubspot.unsyncActionModalTitle')}
          body={t('integrationItems.hubspot.unsyncActionModalBody')}
        />
      )}

      {confirmUnsyncSlack && (
        <ConfirmationModal
          closeModal={() => setConfirmUnsyncSlack(false)}
          actionText={t('integrationItems.slack.unsync')}
          onSubmit={handleSlackUnsync}
          title={t('integrationItems.slack.unsyncActionModalTitle')}
          body={t('integrationItems.slack.unsyncActionModalBody')}
        />
      )}

      <IntegrationsSettingsWrapper>
        <h1>{t('title')}</h1>
        <p className="subtitle">{t('subtitle')}</p>

        <StyledItemsWrapper>
          <IntegrationItem
            integration="hubspot"
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

          <IntegrationItem
            integration="slack"
            disabledSync={isSyncedStarted || !syncedSlack}
            synced={syncedSlack}
            syncUrl={slackUrl}
            onUnSync={() => setConfirmUnsyncSlack(true)}
          >
            <SlackLogo />
            <span>{t('integrationItems.slack.title')}</span>
          </IntegrationItem>
        </StyledItemsWrapper>
      </IntegrationsSettingsWrapper>
    </LayoutWeb>
  );
};

export default IntegrationsPage;
