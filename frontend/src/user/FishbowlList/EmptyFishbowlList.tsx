/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ROUTE_FISHBOWL_CREATE, ROUTE_FISHBOWL_HOST_NOW } from '@/app.config';
import Button from '@/components/Common/Button';
import RedirectLink from '@/components/Web/RedirectLink';
import { pushEventDataLayer } from '@/lib/analytics';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { StyledEmptyFishbowlList } from './styles';

const EmptyFishbowlList = ({ isPastList }: { isPastList?: boolean }) => {
  const { t } = useTranslation('fishbowl-list');
  return (
    <StyledEmptyFishbowlList data-testid="empty-list">
      <div className="fishbowl-list__empty-illustration">
        {/* // eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="multi"
          src="/img/fishbowl-list/empty-chairs-table.png"
          alt="Empty chairs with table"
        />
        <img className="single" src="/img/fishbowl-list/empty-chair.png" alt="Empty chair" />
      </div>
      <h2 className="body-lg medium">
        {isPastList ? (
          <Trans i18nKey="fishbowl-list:emptyListTitle" components={{ i: <i /> }} />
        ) : (
          <Trans i18nKey="fishbowl-list:emptyPastListTitle" components={{ i: <i /> }} />
        )}
      </h2>
      <p>
        {isPastList ? (
          <Trans i18nKey="fishbowl-list:emptyListDescription" components={{ i: <i /> }} />
        ) : (
          <Trans i18nKey="fishbowl-list:emptyPastListDescription" components={{ i: <i /> }} />
        )}
      </p>
      <div className="empty-actions">
        <RedirectLink href={ROUTE_FISHBOWL_CREATE} passHref>
          <Button
            as="a"
            variant="secondary"
            size="large"
            className="animate-item cta-create-fishbowl"
            onClick={() => {
              pushEventDataLayer({
                category: 'Schedule Fishbowl',
                action: 'Empty Fishbowl List',
                label: 'Fishbowl List'
              });
            }}
          >
            <span>{t('common:scheduleFishbowl')}</span>
          </Button>
        </RedirectLink>
        <RedirectLink href={ROUTE_FISHBOWL_HOST_NOW} passHref>
          <Button
            as="a"
            size="large"
            className="animate-item cta-create-fishbowl"
            onClick={() => {
              pushEventDataLayer({
                category: 'Host Fishbowl Now',
                action: 'Empty Fishbowl List',
                label: 'Fishbowl List'
              });
            }}
          >
            <span>{t('common:hostFishbowlNow')}</span>
          </Button>
        </RedirectLink>
      </div>
    </StyledEmptyFishbowlList>
  );
};

export default EmptyFishbowlList;
