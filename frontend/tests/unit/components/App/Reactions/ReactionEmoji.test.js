/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render } from '@testing-library/react';
import ReactionEmoji from '@/components/App/Reactions/ReactionEmoji';

describe('Reaction emoji component', () => {
  it('It renders the component', () => {
    const { container, getByTestId } = render(<ReactionEmoji emoji="agree" />);
    const emojiReaction = getByTestId('emoji-reaction-agree');
    const emojiSVG = container.querySelector('svg');

    expect(emojiReaction).toBeInTheDocument();

    expect(emojiSVG).toBeInTheDocument();
  });
});
