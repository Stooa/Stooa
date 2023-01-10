/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render } from '@testing-library/react';
import ScreenShareButton from '@/components/App/ScreenShareButton';

describe('Unit test of screen share button', () => {
  it('It renders screen share button', () => {
    const { getByTestId } = render(<ScreenShareButton />);

    const button = getByTestId('screen-share-button');

    expect(button.classList.contains('sharing')).toBe(false);
  });

  it('It renders screen share button when sharing', () => {
    const { getByTestId } = render(
      <ScreenShareButton isSharing={true} onClick={() => jest.fn()} />
    );

    const button = getByTestId('screen-share-button');

    expect(button.classList.contains('sharing')).toBe(true);
  });
});
