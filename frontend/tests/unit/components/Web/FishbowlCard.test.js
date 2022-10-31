/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render, screen } from '@testing-library/react';
import FishbowlCard from '@/user/FishbowlList/FishbowlCard';

const TWENTY_MINUTES_IN_MS = 20 * 60 * 1000;
const HOUR_IN_MS = 1000 * 60 * 60;
const TWO_HOURS_IN_MS = 2 * HOUR_IN_MS;

const mockFishbowl = {
  id: '/fishbowls/a34b3ba8-df6b-48f2-b41c-0ef612b432a7',
  type: 'Fishbowl',
  name: 'repellendus voluptatibus rerum',
  description: 'Ratione et maiores itaque ut debitis.',
  slug: 'test-me-fishbowl',
  timezone: 'Europe/Madrid',
  locale: 'en',
  host: '/users/2b8ccbf5-fbd8-4c82-9b61-44e195348404',
  currentStatus: 'not_started',
  participants: [],
  isFishbowlNow: false,
  hasIntroduction: false,
  startDateTimeTz: new Date(Date.now() + TWENTY_MINUTES_IN_MS),
  endDateTimeTz: new Date(Date.now() + TWO_HOURS_IN_MS),
  durationFormatted: '02:00'
};

const mockFishbowlMoreThanThirty = {
  id: '/fishbowls/a34b3ba8-df6b-48f2-b41c-0ef612b432a7',
  type: 'Fishbowl',
  name: 'repellendus voluptatibus rerum',
  description: 'Ratione et maiores itaque ut debitis.',
  slug: 'test-me-fishbowl',
  timezone: 'Europe/Madrid',
  locale: 'en',
  host: '/users/2b8ccbf5-fbd8-4c82-9b61-44e195348404',
  currentStatus: 'not_started',
  participants: [],
  isFishbowlNow: false,
  hasIntroduction: false,
  startDateTimeTz: new Date(Date.now() + HOUR_IN_MS),
  endDateTimeTz: new Date(Date.now() + TWO_HOURS_IN_MS),
  durationFormatted: '02:00'
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/fishbowl/list',
      pathname: '',
      query: '',
      asPath: ''
    };
  }
}));

describe('Unit test of fishbowl card at fishbowl list', () => {
  it('Fishbowl with all buttons visible', () => {
    render(<FishbowlCard fishbowl={mockFishbowl} onClick={() => console.log('void')} />);
    const title = screen.getByRole('heading');
    const info = screen.getByTestId('card-info');
    const actions = screen.getByTestId('card-actions');
    const enterFishbowl = screen.getByTestId('enter-fishbowl');
    const copyLink = screen.getByTestId('copy-link');

    expect(title).toBeInTheDocument();
    expect(info).toBeInTheDocument();
    expect(actions).toBeInTheDocument();
    expect(enterFishbowl).toBeInTheDocument();
    expect(copyLink).toBeInTheDocument();
  });

  it('Fishbowl with only copy link visible', () => {
    render(
      <FishbowlCard fishbowl={mockFishbowlMoreThanThirty} onClick={() => console.log('void')} />
    );
    const title = screen.getByRole('heading');
    const info = screen.getByTestId('card-info');
    const actions = screen.getByTestId('card-actions');
    const enterFishbowl = screen.queryByTestId('enter-fishbowl');
    const copyLink = screen.getByTestId('copy-link');

    expect(title).toBeInTheDocument();
    expect(info).toBeInTheDocument();
    expect(actions).toBeInTheDocument();
    expect(enterFishbowl).toBeNull();
    expect(copyLink).toBeInTheDocument();
  });
});
