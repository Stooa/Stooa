/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Fishbowl } from '@/types/api-platform/interfaces/fishbowl';
import FishbowlCard from './FishbowlCard';
import { FishbowlListWrapper, Header, ScrollWrapper } from './styles';

const FishbowlList = () => {
  //todays date
  const today = new Date(Date.now());
  const tomorrow = new Date(Date.now() + 86400000);

  const fishbowlsmockup: Fishbowl[] = [
    {
      name: 'fishbowl 1',
      description: 'fishbowl 1 description',
      startDateTime: tomorrow,
      durationFormatted: '01:00',
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
      slug: 'fjaksjklda',
      locale: 'en',
      currentStatus: 'open'
    }
  ];

  return (
    <FishbowlListWrapper>
      <Header>
        <div>
          <h1 className="fishbowlist__title">Scheduled fishbowls (10)</h1>
        </div>
        <span className="divider" />
      </Header>
      <ScrollWrapper>
        {fishbowlsmockup.map((fishbowl, index) => (
          <FishbowlCard key={index} fishbowl={fishbowl} />
        ))}
      </ScrollWrapper>
    </FishbowlListWrapper>
  );
};

export default FishbowlList;
