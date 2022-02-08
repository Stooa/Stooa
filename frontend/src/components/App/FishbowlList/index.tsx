/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { ROUTE_FISHBOWL_CREATE } from '@/app.config';

import RedirectLink from '@/components/Web/RedirectLink';
import { pushEventDataLayer } from '@/lib/analytics';
import { Fishbowl } from '@/types/api-platform/interfaces/fishbowl';
import { ButtonSmall } from '@/ui/Button';
import FishbowlCard from './FishbowlCard';
import { FishbowlListWrapper, Header, ScrollWrapper } from './styles';

import PlusSign from '@/ui/svg/plus-sign.svg';
import { getAuthToken } from '@/lib/auth';
import api from '@/lib/api';

const FishbowlList = () => {
  const { t, lang } = useTranslation('common');

  //todays date
  const today = new Date(Date.now());
  const tomorrow = new Date(Date.now() + 86400000);

  const fishbowlsmockup: Fishbowl[] = [
    {
      name: 'fishbowl 1',
      description: 'fishbowl 1 description',
      startDateTime: tomorrow,
      durationFormatted: '01:00',
      duration: tomorrow,
      timezone: 'Europe/Paris',
      slug: 'fjaksjklda',
      locale: 'en',
      currentStatus: 'open'
    },
    {
      name: 'fishbowl 2',
      description: 'fishbowl 1 description',
      startDateTime: tomorrow,
      timezone: 'Europe/Paris',
      durationFormatted: '01:00',
      duration: tomorrow,
      slug: 'fjaksjklda',
      locale: 'en',
      currentStatus: 'open'
    },
    {
      name: 'fishbowl 3',
      description: 'fishbowl 1 description',
      startDateTime: tomorrow,
      timezone: 'Europe/Paris',
      durationFormatted: '01:00',
      duration: tomorrow,
      slug: 'fjaksjklda',
      locale: 'en',
      currentStatus: 'open'
    },
    {
      name: 'fishbowl 4',
      description: 'fishbowl 1 description',
      startDateTime: tomorrow,
      timezone: 'Europe/Paris',
      durationFormatted: '01:00',
      duration: tomorrow,
      slug: 'fjaksjklda',
      locale: 'en',
      currentStatus: 'open'
    },
    {
      name: 'fishbowl 5',
      description: 'fishbowl 1 description',
      startDateTime: tomorrow,
      timezone: 'Europe/Paris',
      durationFormatted: '01:00',
      duration: tomorrow,
      slug: 'fjaksjklda',
      locale: 'en',
      currentStatus: 'open'
    },
    {
      name: 'fishbowl 5',
      description: 'fishbowl 1 description',
      startDateTime: today,
      timezone: 'Europe/Paris',
      durationFormatted: '01:00',
      duration: tomorrow,
      slug: 'fjaksjklda',
      locale: 'en',
      currentStatus: 'open'
    },
    {
      name: 'fishbowl 5',
      description: 'fishbowl 1 description',
      startDateTime: today,
      timezone: 'Europe/Paris',
      durationFormatted: '01:00',
      duration: tomorrow,
      slug: 'fjaksjklda',
      locale: 'en',
      currentStatus: 'open'
    },
    {
      name: 'fishbowl 5',
      description: 'fishbowl 1 description',
      startDateTime: today,
      timezone: 'Europe/Paris',
      durationFormatted: '01:00',
      duration: tomorrow,
      slug: 'fjaksjklda',
      locale: 'en',
      currentStatus: 'open'
    }
  ];

  const handleClick = fid => {
    console.log(fid);
  };

  const getFishbowls = async () => {
    const auth = await getAuthToken();

    api.get(`/fishbowls`, { headers: { Authorization: `Bearer ${auth}` } }).then(response => {
      console.log(response.data);
    });
  };

  useEffect(() => {
    getFishbowls();
  }, []);

  return (
    <FishbowlListWrapper>
      <Header>
        <div>
          <h1 className="fishbowlist__title">Scheduled fishbowls (10)</h1>
          <RedirectLink href={ROUTE_FISHBOWL_CREATE} locale={lang} passHref>
            <ButtonSmall
              className="secondary"
              onClick={() => {
                pushEventDataLayer({
                  category: 'Schedule Fishbowl',
                  action: 'Header',
                  label: window.location.href
                });
              }}
            >
              <span>{t('scheduleFishbowl')}</span>
              <PlusSign />
            </ButtonSmall>
          </RedirectLink>
        </div>
        <span className="divider" />
      </Header>
      <ScrollWrapper>
        {fishbowlsmockup.map((fishbowl, index) => (
          <FishbowlCard onClick={fid => handleClick(fid)} key={index} fishbowl={fishbowl} />
        ))}
      </ScrollWrapper>
    </FishbowlListWrapper>
  );
};

export default FishbowlList;
