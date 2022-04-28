/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render, screen } from '@testing-library/react';
import FishbowlDataCard from '@/components/Web/FishbowlDataCard';

const HOUR_IN_MS = 1000 * 60 * 60;
const TWO_HOURS_IN_MS = 2 * HOUR_IN_MS;

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/fishbowl/detail',
      pathname: '',
      query: '',
      asPath: ''
    };
  }
}));

const fishbowlData = {
  id: '1001',
  name: "Fishbowl name",
  slug: 'mock-slug',
  locale: 'es',
  currentStatus: 'ready',
  startDateTimeTz: new Date(Date.now() + HOUR_IN_MS),
  endDateTimeTz: new Date(Date.now() + TWO_HOURS_IN_MS),
  durationFormatted: '01:00',
};

describe("Unit test of fishbowl data card at fishbol's detail", () => {

  it('Fishbowl data card without description', () => {
    render(
      <FishbowlDataCard data={fishbowlData} />
    );
    const title = screen.getByRole('heading');
    const info = screen.getByTestId('fishbowl-description');

    expect(title).toBeInTheDocument();
    expect(info).toBeInTheDocument();

  });
});
