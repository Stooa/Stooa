/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { formatDateTime, getMonthsForLocale } from '@/lib/helpers';
import { render, screen } from '@testing-library/react';
import FishbowlDataCard from '@/components/Web/FishbowlDataCard';

import I18nProvider from 'next-translate/I18nProvider';
import fishbowlES from '@/locales/es/fishbowl.json';

const HOUR_IN_MS = 1000 * 60 * 60;
const TWO_HOURS_IN_MS = 2 * HOUR_IN_MS;

const fishbowlData = {
  id: '1001',
  name: 'Fishbowl name',
  slug: 'mock-slug',
  locale: 'es',
  currentStatus: 'ready',
  startDateTimeTz: new Date(Date.now() + HOUR_IN_MS),
  endDateTimeTz: new Date(Date.now() + TWO_HOURS_IN_MS),
  durationFormatted: '01:00'
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/fishbowl/detail',
      pathname: '',
      query: '',
      asPath: '',
      locale: 'es-ES'
    };
  }
}));

describe("Unit test of fishbowl data card at fishbol's detail", () => {
  it('Fishbowl data card without description', () => {
    render(
      <I18nProvider lang={fishbowlData.locale} namespaces={{ fishbowl: fishbowlES }}>
        <FishbowlDataCard data={fishbowlData} />
      </I18nProvider>
    );
    const { time: startTime } = formatDateTime(fishbowlData.startDateTimeTz);
    const { day, year, time: endTime } = formatDateTime(fishbowlData.endDateTimeTz);
    const monthName = getMonthsForLocale(fishbowlData.locale)[
      new Date(fishbowlData.startDateTimeTz).getMonth()
    ];

    const dateWithStringMonth = `${
      monthName.charAt(0).toUpperCase() + monthName.slice(1)
    } ${day}, ${year}`;
    const durationHoursString = `${startTime} - ${endTime}`;

    const title = screen.getByRole('heading');
    const description = screen.queryByTestId('fishbowl-description');
    const dateWithMonth = screen.getByText(dateWithStringMonth);
    const durationHours = screen.getByText(durationHoursString);

    expect(title).toBeInTheDocument();
    expect(description).not.toBeInTheDocument();
    expect(dateWithMonth).toBeInTheDocument();
    expect(durationHours).toBeInTheDocument();
  });

  it('Fishbowl data card with description', () => {
    render(
      <I18nProvider lang={fishbowlData.locale} namespaces={{ fishbowl: fishbowlES }}>
        <FishbowlDataCard
          data={{
            ...fishbowlData,
            description: 'An amazing description of this super dupper cool event.'
          }}
        />
      </I18nProvider>
    );
    const { time: startTime } = formatDateTime(fishbowlData.startDateTimeTz);
    const { day, year, time: endTime } = formatDateTime(fishbowlData.endDateTimeTz);
    const monthName = getMonthsForLocale(fishbowlData.locale)[
      new Date(fishbowlData.startDateTimeTz).getMonth()
    ];

    const dateWithStringMonth = `${
      monthName.charAt(0).toUpperCase() + monthName.slice(1)
    } ${day}, ${year}`;
    const durationHoursString = `${startTime} - ${endTime}`;

    const title = screen.getByRole('heading');
    const description = screen.getByTestId('fishbowl-description');
    const dateWithMonth = screen.getByText(dateWithStringMonth);
    const durationHours = screen.getByText(durationHoursString);

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(dateWithMonth).toBeInTheDocument();
    expect(durationHours).toBeInTheDocument();
  });
});
