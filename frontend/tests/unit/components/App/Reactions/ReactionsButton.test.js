/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render } from '@testing-library/react';
import ReactionsButton from '@/components/App/Reactions/ReactionsButton';

describe('Reactions button component', () => {
  it('It renders the component', () => {
    const { getByTestId } = render(<ReactionsButton />);
    const wrapperReactionsButton = getByTestId('wrapper-reactions-button');
    const reactionsButton = getByTestId('reactions-button');

    expect(wrapperReactionsButton).toBeInTheDocument();
    expect(reactionsButton).toBeInTheDocument();
  });

  it('It renders the component disabled', () => {
    const { getByTestId } = render(<ReactionsButton disabled={true} />);
    const reactionsButton = getByTestId('reactions-button');

    expect(reactionsButton).toBeInTheDocument();
    expect(reactionsButton).toBeDisabled();
  });
});
