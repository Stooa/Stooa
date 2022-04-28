/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { formatDateTime, getMonthsForLocale } from '@/lib/helpers';
import { Fishbowl } from '@/types/api-platform';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { StyledFishbowlDataCard } from './styles';

interface Props {
  data: Fishbowl;
}

const FishbowlDataCard = ({ data }: Props) => {
  const { time: startTime } = formatDateTime(data.startDateTimeTz);
  const { day, year, time: endTime } = formatDateTime(data.endDateTimeTz);
  const { locale } = useRouter();

  const monthName = getMonthsForLocale(locale)[new Date(data.startDateTimeTz).getMonth()];

  return (
    <StyledFishbowlDataCard>
      <p className="body-xs card-subtitle">Fishbowl Details</p>
      <h2 className="body-md medium ">{data.name}</h2>
      {data.description && (
        <p className="description body-sm" data-testid="fishbowl-description">
          {data.description}
        </p>
      )}

      <div className="date">
        <p className="body-xs" data-testid="date-with-month">{`${
          monthName.charAt(0).toUpperCase() + monthName.slice(1)
        } ${day}, ${year}`}</p>
        <p className="body-xs">{`${startTime} - ${endTime}`}</p>
      </div>

      <Link passHref href={`/fb/${data.slug}`}>
        <a className="decorated colored">Edit event details</a>
      </Link>
    </StyledFishbowlDataCard>
  );
};

export default FishbowlDataCard;
