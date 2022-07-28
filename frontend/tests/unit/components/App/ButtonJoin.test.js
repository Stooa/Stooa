/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ButtonJoin from '@/components/App/ButtonJoin';
import { render, screen } from '@testing-library/react';

jest.mock('@/contexts/DevicesContext', () => ({
  useDevices() {
    return {
      audio: true,
      video: true
    };
  }
}));

jest.mock('@/contexts/AppContext', () => ({
  useStateValue() {
    return [
      {
        conferenceStatus: 'NOT_STARTED',
        isGuest: true
      }
    ];
  }
}));

describe('Unit test of button join', () => {
  it('should render the `button` with alert', () => {
    const { getByRole, getByTestId } = render(
      <ButtonJoin
        permissions={false}
        join={user => console.log('user joined', user)}
        leave={() => console.log()}
        joined={false}
        disabled={false}
      />
    );

    const button = getByRole('button');
    const alert = getByTestId('permission-alert');

    expect(button).toBeInTheDocument();
    expect(alert).toBeInTheDocument();
  });

  it('should render the `button` without alert', () => {
    const { getByRole, queryByTestId } = render(
      <ButtonJoin
        permissions={true}
        join={user => console.log('user joined', user)}
        leave={() => console.log()}
        joined={false}
        disabled={false}
      />
    );

    const button = getByRole('button');
    const alert = queryByTestId('permission-alert');

    expect(button).toBeInTheDocument();
    expect(alert).not.toBeInTheDocument();
  });
});
