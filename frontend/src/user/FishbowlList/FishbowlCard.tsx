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
import { isTimeLessThanNMinutes } from '@/lib/helpers';
import { pushEventDataLayer } from '@/lib/analytics';

import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import RedirectLink from '@/components/Web/RedirectLink';
import { Fishbowl } from '@/types/api-platform';

import { CardStyled, CardTitle } from '@/user/FishbowlList/styles';
import { convertIntoClassName } from '@/lib/helpers';
import Button from '@/components/Common/Button';
import Icon from '@/components/Common/Fields/Icon';

interface Props {
  fishbowl: Fishbowl;
  selected?: boolean;
  onClick: (fishbowl: Fishbowl) => void;
}

const FishbowlCard = ({ fishbowl, selected, onClick }: Props) => {
  const { t } = useTranslation('fishbowl-list');
  const { name, startDateTimeTz, slug, locale, isPrivate, plainPassword } = fishbowl;

  const startDateTime = new Date(startDateTimeTz);

  const month = startDateTime.toLocaleString('default', { month: 'long' });
  const day = startDateTime.toLocaleString('default', { day: 'numeric' });
  const time = startDateTime.toLocaleString('default', { hour: 'numeric', minute: 'numeric' });
  const year = startDateTime.toLocaleString('default', { year: 'numeric' });

  const handleGoToFishbowl = () => {
    const route = `${ROUTE_FISHBOWL}/${slug}`;
    pushEventDataLayer({
      category: 'Enter Fishbowl',
      action: 'Enter Fishbowl From List',
      label: route
    });
    router.push(route, route, { locale: locale });
  };

  const handleClick = event => {
    if (!event.target.parentElement.classList.contains('card__actions')) {
      onClick(fishbowl);
    }
  };

  return (
    <CardStyled
      className={`${selected ? 'selected-card' : ''}`}
      onClick={handleClick}
      data-testid={convertIntoClassName(name)}
    >
      <CardTitle>
        {isPrivate && (
          <span className="icon-wrapper">
            <Icon variant="lock" />
          </span>
        )}
        <h4 data-testid="fishbowl-title">{name}</h4>
      </CardTitle>

      <div data-testid="card-info" className="card__info">
        <div className="card__date">
          {month} {day}, {year}
        </div>
        <div className="card__time">{time}</div>
      </div>

      <div data-testid="card-actions" className="card__actions">
        <ButtonCopyUrl
          data-testid="copy-link"
          variant="text"
          eventType="fishbowl"
          slug={slug}
          locale={locale}
          isPrivate={isPrivate}
          plainPassword={plainPassword ?? 'error ask for the password'}
        />
        {isTimeLessThanNMinutes(startDateTime, 30) && (
          <RedirectLink href={`${ROUTE_FISHBOWL}/${slug}`} locale={locale} passHref>
            <Button
              className="never-full"
              as="a"
              data-testid="enter-fishbowl"
              onClick={() => {
                handleGoToFishbowl();
              }}
            >
              <span>{t('enterFishbowl')}</span>
            </Button>
          </RedirectLink>
        )}
      </div>
    </CardStyled>
  );
};

export default FishbowlCard;
