/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import router from 'next/router';
import useTranslation from 'next-translate/useTranslation';

import { ROUTE_FISHBOWL } from '@/app.config';
import { formatDateTime, isTimeLessThanNMinutes } from '@/lib/helpers';
import { pushEventDataLayer } from '@/lib/analytics';

import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import RedirectLink from '@/components/Web/RedirectLink';
import { Fishbowl } from '@/types/api-platform/interfaces/fishbowl';

import { CardStyled, CardTitle } from '@/components/App/FishbowlList/styles';
import { ButtonStyledLinkSmall } from '@/ui/Button';
import ArrowRight from '@/ui/svg/arrow-right.svg';
import {convertIntoClassName} from "@/lib/helpers";

interface Props {
  fishbowl: Fishbowl;
  selected?: boolean;
  onClick: (fishbowl: Fishbowl) => void;
}

const FishbowlCard = ({ fishbowl, selected, onClick }: Props) => {
  const { t } = useTranslation('fishbowl-list');
  const { name, startDateTimeTz, slug, locale } = fishbowl;

  const startDateTime = new Date(startDateTimeTz);

  const month = startDateTime.toLocaleString('default', { month: 'long' });
  const day = startDateTime.toLocaleString('default', { day: 'numeric' });
  const { time, year, timezone: timezoneCode } = formatDateTime(startDateTimeTz);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleGoToFishbowl = () => {
    const route = `${ROUTE_FISHBOWL}/${slug}`;
    pushEventDataLayer({
      category: 'Enter Fishbowl',
      action: 'Enter Fishbowl From List',
      label: route
    });
    router.push(route, route, { locale: locale });
  };

  return (
    <CardStyled className={`${selected ? 'selected-card' : ''}`} onClick={() => onClick(fishbowl)} data-cy={convertIntoClassName(name)}>
      <CardTitle>
        <h4>{name}</h4>
      </CardTitle>
      <div data-testid="card-info" className="card__info">
        <div>
          {month} {day}, {year}
        </div>
        <div className="card__time">
          {time}
          <span>{` (${timezoneCode}) ${timezone} `}</span>
        </div>
      </div>
      <div data-testid="card-actions" className="card__actions">
        <ButtonCopyUrl data-testid="copy-link" variant="link" fid={slug} locale={locale}>
          {t('common:linkButton')}
        </ButtonCopyUrl>
        {isTimeLessThanNMinutes(startDateTime, 30) && (
          <RedirectLink href={`${ROUTE_FISHBOWL}/${slug}`} locale={locale} passHref>
            <ButtonStyledLinkSmall
              data-testid="enter-fishbowl"
              onClick={() => {
                handleGoToFishbowl;
              }}
            >
              <span>{t('enterFishbowl')}</span>
              <ArrowRight />
            </ButtonStyledLinkSmall>
          </RedirectLink>
        )}
      </div>
    </CardStyled>
  );
};

export default FishbowlCard;
