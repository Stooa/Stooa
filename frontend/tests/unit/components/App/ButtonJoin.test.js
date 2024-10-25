/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ButtonJoin from '@/components/App/ButtonJoin';
import { useStateValue } from '@/contexts/AppContext';
import { fireEvent, render } from '@testing-library/react';
import { pushEventDataLayer } from '@/lib/analytics';
import { useUser } from '@/jitsi';

jest.mock('@/lib/analytics');
jest.mock('@/jitsi');
jest.mock('@/contexts/AppContext');

useUser.mockReturnValue({
  getUser: jest.fn()
});

jest.mock('@/contexts/DevicesContext', () => ({
  useDevices() {
    return {
      setShowModalPermissions: jest.fn()
    };
  }
}));

describe('Unit test of button join', () => {
  it('should render the `button` with alert', () => {
    useStateValue.mockReturnValue([
      {
        conferenceStatus: 'NOT_STARTED',
        isGuest: true
      }
    ]);

    const { getByRole, getByTestId } = render(
      <ButtonJoin
        permissions={false}
        join={jest.fn()}
        leave={jest.fn()}
        joined={false}
        disabled={false}
      />
    );

    const button = getByRole('button');
    const alert = getByTestId('permission-alert');

    expect(button).toBeInTheDocument();
    expect(alert).toBeInTheDocument();
  });

  it('should render the `button` without alert when does not have permissions', () => {
    const { getByRole, queryByTestId } = render(
      <ButtonJoin
        permissions={true}
        join={jest.fn()}
        leave={jest.fn()}
        joined={false}
        disabled={false}
      />
    );

    const button = getByRole('button');
    const alert = queryByTestId('permission-alert');

    expect(button).toBeInTheDocument();
    expect(alert).not.toBeInTheDocument();
  });

  it('should render the `button` with arrow up to join', () => {
    const { getByRole, getByTestId } = render(
      <ButtonJoin
        permissions={false}
        join={jest.fn()}
        leave={jest.fn()}
        joined={false}
        disabled={false}
      />
    );

    const button = getByRole('button');
    const arrowUp = getByTestId('arrow-up');

    expect(button).toBeInTheDocument();
    expect(arrowUp).toBeInTheDocument();
  });

  it('should render the `button` with arrow down to leave', () => {
    const { getByRole, getByTestId } = render(
      <ButtonJoin
        permissions={false}
        join={jest.fn()}
        leave={jest.fn()}
        joined={true}
        disabled={false}
      />
    );

    const button = getByRole('button');
    const arrowDown = getByTestId('arrow-down');

    expect(button).toBeInTheDocument();
    expect(arrowDown).toBeInTheDocument();
  });

  it('should call the join event', async () => {
    const joinEvent = jest.fn();

    const { getByRole } = render(
      <ButtonJoin
        permissions={true}
        join={joinEvent}
        leave={jest.fn()}
        joined={false}
        disabled={false}
      />
    );

    const button = getByRole('button');

    fireEvent.click(button);

    expect(button).toBeInTheDocument();
    expect(joinEvent).toHaveBeenCalled();
    expect(pushEventDataLayer).toHaveBeenCalled();
  });

  it('should call the leave event', async () => {
    const leaveEvent = jest.fn();

    const { getByRole } = render(
      <ButtonJoin
        permissions={true}
        join={jest.fn()}
        leave={leaveEvent}
        joined={true}
        disabled={false}
      />
    );

    const button = getByRole('button');

    fireEvent.click(button);

    expect(button).toBeInTheDocument();
    expect(leaveEvent).toHaveBeenCalled();
    expect(pushEventDataLayer).toHaveBeenCalled();
  });
});
