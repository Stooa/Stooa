/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';
import {
  StyledIntegrationItem,
  StyledItemDescription,
  StyledIntegrationContent,
  StyledSyncActions
} from './styles';

import Button from '@/components/Common/Button';

interface Props {
  onButtonAction: () => void;
  disabledSync: boolean;
  syncUrl: string;
  children: JSX.Element | JSX.Element[];
  synced?: boolean;
  onUnSync?: () => void;
  lastSyncDate?: string;
}

export const IntegrationItem = ({
  syncUrl,
  synced,
  children,
  onUnSync,
  disabledSync,
  onButtonAction,
  lastSyncDate
}: Props) => {
  // TODO: If this goes to prod make a prop with actions and map then into buttons
  const { t } = useTranslation('integrations');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (synced) {
      e.preventDefault();
      onUnSync && onUnSync();
    }
  };

  const formatLastSyncDateWithHour = (date: string) => {
    const parsedDate = new Date(date);
    const day = parsedDate.getDate();
    const month = parsedDate.getMonth() + 1;
    const year = parsedDate.getFullYear();
    const hour = parsedDate.getHours();
    const minutes = parsedDate.getMinutes();

    return `${hour}:${minutes} - ${day}/${month}/${year} `;
  };

  return (
    <StyledIntegrationItem>
      <StyledIntegrationContent>
        <StyledItemDescription>{children}</StyledItemDescription>
        <a
          href={synced ? '' : syncUrl}
          onClick={handleClick}
          className={`medium colored ${synced ? 'red' : ''}`}
        >
          {synced ? t('integrationItems.hubspot.unsync') : t('integrationItems.hubspot.sync')}
        </a>
      </StyledIntegrationContent>

      {(synced || lastSyncDate) && (
        <StyledSyncActions>
          {lastSyncDate && (
            <span>
              {t('integrationItems.hubspot.lastSync')} <br />
              {formatLastSyncDateWithHour(lastSyncDate)}
            </span>
          )}
          <Button disabled={disabledSync} onClick={onButtonAction}>
            {t('integrationItems.hubspot.syncAction')}
          </Button>
        </StyledSyncActions>
      )}
    </StyledIntegrationItem>
  );
};
