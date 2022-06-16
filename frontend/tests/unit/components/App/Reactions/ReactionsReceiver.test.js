/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { fireEvent, render } from '@testing-library/react';
import ReactionsReceiver from '@/components/App/Reactions/ReactionsReceiver';

describe('Reactions receiver component', () => {
  it('It renders the component', () => {
    const { getByTestId } = render(<ReactionsReceiver />);
    const reactionsReceiver = getByTestId('reactions-receiver');

    expect(reactionsReceiver).toBeInTheDocument();
  });
});
