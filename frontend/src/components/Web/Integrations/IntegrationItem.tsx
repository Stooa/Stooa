/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useState } from 'react';
import { StyledIntegrationItem, StyledItemDescription, StyledIntegrationContent } from './styles';

import Button from '@/components/Common/Button';
import Hubspot from '@/lib/Integrations/Hubspot';

interface Props {
  syncUrl: string;
  children: JSX.Element | JSX.Element[];
  synced?: boolean;
  onUnSync?: () => void;
}

export const IntegrationItem = ({ syncUrl, synced, children, onUnSync }: Props) => {
  const [isSyncedStarted, setIsSyncedStarted] = useState(false);

  // TODO: If this goes to prod make a prop with actions and map then into buttons
  const handleSyncContacts = async () => {
    await Hubspot.syncHubspotContacts();
    setIsSyncedStarted(true);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (synced) {
      e.preventDefault();
      onUnSync && onUnSync();
    }
  };

  return (
    <StyledIntegrationItem>
      <StyledIntegrationContent>
        <StyledItemDescription>{children}</StyledItemDescription>
        <a href={synced ? '' : syncUrl} onClick={handleClick} className="medium colored">
          {synced ? 'Unsync' : 'Sync'}
        </a>
      </StyledIntegrationContent>

      {synced && (
        <Button disabled={isSyncedStarted} onClick={handleSyncContacts}>
          Vincular usuarios
        </Button>
      )}
    </StyledIntegrationItem>
  );
};
