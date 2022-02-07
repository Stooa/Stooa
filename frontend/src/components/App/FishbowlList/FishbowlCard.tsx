/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import { formatDateTime } from '@/lib/helpers';
import { Fishbowl } from '@/types/api-platform/interfaces/fishbowl';
import useTranslation from 'next-translate/useTranslation';
import { CardStyled } from './styles';

interface Props {
  fishbowl: Fishbowl;
}

const FishbowlCard = ({ fishbowl }: Props) => {
  const { t } = useTranslation('common');
  const { name, startDateTime, slug, timezone, locale } = fishbowl;

  const month = startDateTime.toLocaleString('default', { month: 'long' });
  const day = startDateTime.toLocaleString('default', { day: 'numeric' });
  const { time, year } = formatDateTime(startDateTime);

  const offset = startDateTime.getTimezoneOffset() / 60;

  return (
    <CardStyled>
      <div className="card__info">
        <h4 className="card__title">{name}</h4>
        <div>
          {month} {day}, {year}
        </div>
        <div>{time}</div>
        <div>
          {timezone} {offset}
        </div>
      </div>
      <div className="card__actions">
        <ButtonCopyUrl variant="link" fid={slug} locale={locale}>
          {t('linkButton')}
        </ButtonCopyUrl>
      </div>
    </CardStyled>
  );
};

export default FishbowlCard;
