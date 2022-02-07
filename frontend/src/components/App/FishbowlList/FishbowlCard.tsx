/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { formatDateTime } from '@/lib/helpers';
import { Fishbowl } from '@/types/api-platform/interfaces/fishbowl';
import { CardStyled } from './styles';

interface Props {
  fishbowl: Fishbowl;
}

const FishbowlCard = ({ fishbowl }: Props) => {
  const { name, startDateTime, slug, timezone } = fishbowl;

  const month = startDateTime.toLocaleString('default', { month: 'long' });
  const day = startDateTime.toLocaleString('default', { day: 'numeric' });
  const { time, year } = formatDateTime(startDateTime);

  const offset = startDateTime.getTimezoneOffset() / 60;

  return (
    <CardStyled>
      <h4 className="card__title">{name}</h4>
      <div>
        {month} {day}, {year}
      </div>
      <div>{time}</div>
      <div>
        {timezone} {offset}
      </div>
    </CardStyled>
  );
};

export default FishbowlCard;
