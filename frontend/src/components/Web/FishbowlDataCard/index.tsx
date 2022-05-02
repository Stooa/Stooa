/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Link from 'next/link';
import { useRouter } from 'next/router';

import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { ROUTE_FISHBOWL, ROUTE_FISHBOWL_LIST } from '@/app.config';
import Button from '@/components/Common/Button';
import { formatDateTime, getMonthsForLocale, isTimeLessThanNMinutes } from '@/lib/helpers';
import { Fishbowl } from '@/types/api-platform';
import RedirectLink from '../RedirectLink';
import { StyledFishbowlDataCard } from './styles';

interface Props {
  data: Fishbowl;
}

const FishbowlDataCard = ({ data }: Props) => {
  const { time: startTime } = formatDateTime(data.startDateTimeTz);
  const { day, year, time: endTime } = formatDateTime(data.endDateTimeTz);
  const { locale } = useRouter();
  const { t } = useTranslation('form');

  const monthName = getMonthsForLocale(locale)[new Date(data.startDateTimeTz).getMonth()];

  return (
    <StyledFishbowlDataCard>
      <p className="body-xs card-subtitle">
        <Trans i18nKey="fishbowl:detail.cardMiniTitle" components={{ i: <i /> }} />
      </p>
      <h2 className="body-lg medium">{data.name}</h2>
      {data.description && (
        <p className="description body-md" data-testid="fishbowl-description">
          {data.description}
        </p>
      )}

      <div className="date">
        <p className="body-sm" data-testid="date-with-month">{`${
          monthName.charAt(0).toUpperCase() + monthName.slice(1)
        } ${day}, ${year}`}</p>
        <p className="body-sm">{`${startTime} - ${endTime}`}</p>
      </div>

      {isTimeLessThanNMinutes(data.startDateTimeTz, 30) ? (
        <RedirectLink href={`${ROUTE_FISHBOWL}/${data.slug}`} locale={data.locale} passHref>
          <Button size="large" as="a" data-testid="enter-fishbowl">
            <span>{t('button.enterFishbowl')}</span>
          </Button>
        </RedirectLink>
      ) : (
        <Link passHref href={`${ROUTE_FISHBOWL_LIST}?selected=${data.slug}`}>
          <a className="decorated colored">
            <Trans i18nKey="fishbowl:detail.editFishbowlDetails" components={{ i: <i /> }} />
          </a>
        </Link>
      )}
    </StyledFishbowlDataCard>
  );
};

export default FishbowlDataCard;
