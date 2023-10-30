/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import { StyledIntegrationItem, StyledItemDescription, StyledIntegrationContent } from './styles';

import Button from '@/components/Common/Button';
import { SyncHubspotContacts } from '@/repository/SyncHubspotContacts';

interface Props {
  syncUrl: string;
  unsyncUrl: string;
  children: JSX.Element | JSX.Element[];
  synced?: boolean;
}

export const IntegrationItem = ({ syncUrl, unsyncUrl, synced, children }: Props) => {
  // TODO: If this goes to prod make a prop with actions and map then into buttons
  const handleSyncContacts = async () => {
    const data = await SyncHubspotContacts();
    console.log(data);
  };
  return (
    <StyledIntegrationItem>
      <StyledIntegrationContent>
        <StyledItemDescription>{children}</StyledItemDescription>
        <a href={synced ? unsyncUrl : syncUrl} className="medium colored">
          {synced ? 'Unsync' : 'Sync'}
        </a>
      </StyledIntegrationContent>

      {synced && <Button onClick={handleSyncContacts}>Vincular usuarios</Button>}
    </StyledIntegrationItem>
  );
};
