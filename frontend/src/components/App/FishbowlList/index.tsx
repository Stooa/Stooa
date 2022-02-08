/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { ROUTE_FISHBOWL_CREATE } from '@/app.config';

import { Fishbowl } from '@/types/api-platform/interfaces/fishbowl';
import { pushEventDataLayer } from '@/lib/analytics';

import RedirectLink from '@/components/Web/RedirectLink';
import LoadingIcon from '@/components/Common/LoadingIcon';
import { ButtonSmall } from '@/ui/Button';
import FishbowlCard from './FishbowlCard';
import { FishbowlListWrapper, Header, ScrollWrapper } from './styles';

import PlusSign from '@/ui/svg/plus-sign.svg';
import { getAuthToken } from '@/lib/auth';
import api from '@/lib/api';
import Trans from 'next-translate/Trans';

const FishbowlList = () => {
  const [fishbowls, setFishbowls] = useState<Fishbowl[]>(null);
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

  const params = new URLSearchParams([['estimatedDateToFinish[after]', new Date().toISOString()]]);

  const getFishbowls = async () => {
    const auth = await getAuthToken();

    api
      .get(`/fishbowls`, {
        headers: {
          authorization: `${auth ? auth.authorizationString : null}`
        },
        params
      })
      .then(response => {
        console.log(response.data);
        setFishbowls(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getFishbowls();
  }, []);

  if (!fishbowls) {
    return <LoadingIcon />;
  } else {
    return (
      <FishbowlListWrapper>
        <Header>
          <div>
            <h1 className="fishbowlist__title">
              <Trans
                i18nKey="fishbowl-list:scheduledFishbowls"
                components={{ i: <i /> }}
                values={{
                  count: fishbowls.length
                }}
              />
            </h1>
            <RedirectLink href={ROUTE_FISHBOWL_CREATE} locale={lang} passHref>
              <ButtonSmall
                className="secondary"
                onClick={() => {
                  pushEventDataLayer({
                    category: 'Schedule Fishbowl',
                    action: 'Fishbowl List',
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
          {fishbowls.map((fishbowl, index) => (
            <FishbowlCard onClick={fid => handleClick(fid)} key={index} fishbowl={fishbowl} />
          ))}
        </ScrollWrapper>
      </FishbowlListWrapper>
    );
  }
};

export default FishbowlList;
