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
import { ROUTE_FISHBOWL, ROUTE_FISHBOWL_SCHEDULED } from '@/app.config';
import Button from '@/components/Common/Button';
import { formatDateTime, getMonthsForLocale, isTimeLessThanNMinutes } from '@/lib/helpers';
import { Fishbowl } from '@/types/api-platform';
import RedirectLink from '../RedirectLink';
import { StyledFishbowlDataCard } from './styles';
import AddToCalendarButton from '../AddToCalendarButton';

interface Props {
  data: Fishbowl;
  fromLanding?: boolean;
  isModerator?: boolean;
}

const FishbowlDataCard = ({ data, fromLanding, isModerator }: Props) => {
  const { time: startTime } = formatDateTime(data.startDateTimeTz);
  const { day, year, time: endTime } = formatDateTime(data.endDateTimeTz);
  const { locale } = useRouter();
  const { t } = useTranslation('form');

  const monthName = getMonthsForLocale(locale)[new Date(data.startDateTimeTz).getMonth()];

  const isLessThan30Minutes = isTimeLessThanNMinutes(data.startDateTimeTz, 30);

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

        {fromLanding && isLessThan30Minutes && (
          <p className="body-sm">
            Add to calendar <AddToCalendarButton fishbowl={data} />
          </p>
        )}
      </div>

      {!fromLanding && isLessThan30Minutes && (
        <RedirectLink href={`${ROUTE_FISHBOWL}/${data.slug}`} locale={data.locale} passHref>
          <Button size="large" as="a" data-testid="enter-fishbowl">
            <span>{t('button.enterFishbowl')}</span>
          </Button>
        </RedirectLink>
      )}

      {isModerator && !isLessThan30Minutes && (
        <Link
          href={`${ROUTE_FISHBOWL_SCHEDULED}?selected=${data.slug}`}
          className="decorated colored"
        >
          <Trans i18nKey="fishbowl:detail.editFishbowlDetails" components={{ i: <i /> }} />
        </Link>
      )}
    </StyledFishbowlDataCard>
  );
};

export default FishbowlDataCard;
