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

const renderButtonJoin = () => {
  render(<ButtonJoin />);
};

describe('Unit test of button join', () => {
  it('should render the `button`', () => {
    renderButtonJoin();

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
