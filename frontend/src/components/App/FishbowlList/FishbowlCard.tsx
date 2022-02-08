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
import { formatDateTime } from '@/lib/helpers';
import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import RedirectLink from '@/components/Web/RedirectLink';
import { Fishbowl } from '@/types/api-platform/interfaces/fishbowl';

import { CardStyled, CardTitle } from '@/components/App/FishbowlList/styles';
import { ButtonSmall } from '@/ui/Button';
import ArrowRight from '@/ui/svg/arrow-right.svg';

interface Props {
  fishbowl: Fishbowl;
  onClick: (fid: string) => void;
}

const FishbowlCard = ({ fishbowl, onClick }: Props) => {
  const { t } = useTranslation('fishbowl-list');
  const { name, startDateTimeTz, slug, locale } = fishbowl;

  const startDateTime = new Date(startDateTimeTz);

  const month = startDateTime.toLocaleString('default', { month: 'long' });
  const day = startDateTime.toLocaleString('default', { day: 'numeric' });
  const { time, year, timezone } = formatDateTime(startDateTimeTz);

  const offset = startDateTime.getTimezoneOffset() / 60;

  const handleGoToFishbowl = () => {
    const route = `${ROUTE_FISHBOWL}/${slug}`;
    router.push(route, route, { locale: locale });
  };

  return (
    <CardStyled onClick={() => onClick(fishbowl.slug)}>
      <CardTitle>
        <h4>{name}</h4>
      </CardTitle>
      <div className="card__info">
        <div>
          {month} {day}, {year}
        </div>
        <div>
          {time} {offset}
        </div>
        <div>{timezone}</div>
      </div>
      <div className="card__actions">
        <RedirectLink href={`${ROUTE_FISHBOWL}/${slug}`} locale={locale} passHref>
          <ButtonSmall
            onClick={() => {
              handleGoToFishbowl;
            }}
          >
            <span>{t('enterFishbowl')}</span>
            <ArrowRight />
          </ButtonSmall>
        </RedirectLink>

        <ButtonCopyUrl variant="link" fid={slug} locale={locale}>
          {t('common:linkButton')}
        </ButtonCopyUrl>
      </div>
    </CardStyled>
  );
};

export default FishbowlCard;
