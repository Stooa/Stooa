/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import { StyledIntegrationItem, StyledItemDescription } from './styles';

import Link from 'next/link';

interface Props {
  syncUrl: string;
  unsyncUrl: string;
  children: JSX.Element | JSX.Element[];
  synced?: boolean;
}

export const IntegrationItem = ({ syncUrl, unsyncUrl, synced, children }: Props) => {
  return (
    <StyledIntegrationItem>
      <StyledItemDescription>{children}</StyledItemDescription>

      <Link href={synced ? unsyncUrl : syncUrl} className="medium colored">
        {synced ? 'Unsync' : 'Sync'}
      </Link>
    </StyledIntegrationItem>
  );
};
