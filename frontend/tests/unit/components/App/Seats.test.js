/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render } from '@testing-library/react';
import Seats from '@/components/App/Seats';
import { IConferenceStatus } from '@/jitsi/Status';
import { useStooa } from '@/contexts/StooaManager';
import { useStateValue } from '@/contexts/AppContext';
import { useNavigatorType } from '@/hooks/useNavigatorType';
import { makeCurrentFishbowl } from '../../factories/fishbowl';

jest.mock('@/components/App/ButtonContextMenu', () => ({ children }) => <>{children}</>);
jest.mock('@/contexts/StooaManager');
jest.mock('@/contexts/AppContext');
jest.mock('@/hooks/useNavigatorType');

describe('Unit test of fishbowl seats', () => {
  it('Unstarted fishbowl renders 5 unavailable seats', () => {
    useStooa.mockReturnValue({
      data: makeCurrentFishbowl(),
      conferenceReady: false,
      isSharing: false,
      isModerator: true
    });

    useNavigatorType.mockReturnValue({
      deviceType: 'Desktop'
    });

    useStateValue.mockReturnValue([
      { conferenceStatus: IConferenceStatus.NOT_STARTED },
      () => jest.fn()
    ]);

    const { getAllByTestId } = render(<Seats />);

    const seats = getAllByTestId('unavailable-seat');

    expect(seats.length).toBe(5);
  });

  it('Started fishbowl renders 5 available seats', () => {
    useStooa.mockReturnValue({
      data: makeCurrentFishbowl(),
      conferenceReady: false,
      isSharing: false,
      isModerator: true
    });

    useNavigatorType.mockReturnValue({
      deviceType: 'Desktop'
    });

    useStateValue.mockReturnValue([
      { conferenceStatus: IConferenceStatus.RUNNING },
      () => jest.fn()
    ]);

    const { getAllByTestId } = render(<Seats />);

    const seats = getAllByTestId('available-seat');

    expect(seats.length).toBe(5);
  });

  it('Changes layout while is sharing', () => {
    useStooa.mockReturnValue({
      data: makeCurrentFishbowl(),
      conferenceReady: false,
      isSharing: true,
      isModerator: true
    });

    useNavigatorType.mockReturnValue({
      deviceType: 'Desktop'
    });

    useStateValue.mockReturnValue([
      { conferenceStatus: IConferenceStatus.INTRODUCTION },
      () => jest.fn()
    ]);

    const { getByTestId } = render(<Seats />);

    const seatsWrapper = getByTestId('seats-wrapper');

    expect(seatsWrapper.classList.contains('sharing')).toBe(true);
  });
});
