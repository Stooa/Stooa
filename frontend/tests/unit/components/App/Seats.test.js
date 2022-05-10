/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render, screen } from '@testing-library/react';
import Seats from '@/components/App/Seats';
import { CONFERENCE_NOT_STARTED, CONFERENCE_RUNNING } from '@/jitsi/Status';
import I18nProvider from 'next-translate/I18nProvider';

import appEN from 'locales/en/app.json';
import { MockedProvider } from '@apollo/client/testing';
import { useStateValue } from '@/contexts/AppContext';

const introState = {
  fishbowlReady: true,
  fishbowlStarted: false,
  isGuest: false,
  prejoin: false,
  conferenceStatus: CONFERENCE_NOT_STARTED
};

jest.mock('@/contexts/AppContext');
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: ''
    };
  }
}));

jest.mock('@/components/App/ButtonContextMenu', () => ({ children }) => <>{children}</>);

const renderWithContext = () => {
  render(
    <I18nProvider lang={'en'} namespaces={{ app: appEN }}>
      <MockedProvider>
        <Seats />
      </MockedProvider>
    </I18nProvider>
  );
};

describe('Unit test of fishbowl seats', () => {
  it('Unstarted fishbowl renders 5 unavailable seats', () => {
    useStateValue.mockReturnValue([{ conferenceStatus: CONFERENCE_NOT_STARTED }, () => jest.fn()]);

    renderWithContext(introState);

    const seats = screen.getAllByText('Seat unavailable');

    expect(seats.length).toBe(5);
  });

  it('Started fishbowl renders 5 available seats', () => {
    useStateValue.mockReturnValue([{ conferenceStatus: CONFERENCE_RUNNING }, () => jest.fn()]);

    renderWithContext(introState);

    const seats = screen.getAllByText('Seat available');

    expect(seats.length).toBe(5);
  });
});
