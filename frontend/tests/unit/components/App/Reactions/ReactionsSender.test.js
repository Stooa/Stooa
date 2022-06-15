/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render, screen } from '@testing-library/react';
import ReactionsSender from '@/components/App/Reactions/ReactionsSender';
import { useStooa } from '@/contexts/StooaManager';

jest.mock('@/contexts/StooaManager');

describe('Reactions sender component', () => {
  it('It renders the component as moderator', () => {
    useStooa.mockReturnValue({ isModerator: true });

    const { container, getByTestId } = render(<ReactionsSender />);

    const isModeratorClassName = container.getElementsByClassName('moderator');

    expect(isModeratorClassName.length).toBe(1);

    expect(getByTestId('agree-emoji')).toBeInTheDocument();
    expect(getByTestId('disagree-emoji')).toBeInTheDocument();
    expect(getByTestId('love-emoji')).toBeInTheDocument();
    expect(getByTestId('applause-emoji')).toBeInTheDocument();
    expect(getByTestId('joy-emoji')).toBeInTheDocument();
    expect(getByTestId('wave-emoji')).toBeInTheDocument();
    expect(getByTestId('insightful-emoji')).toBeInTheDocument();
  });

  it('It renders the component as user', () => {
    useStooa.mockReturnValue({ isModerator: false });

    const { container } = render(<ReactionsSender />);

    const isModeratorClassName = container.getElementsByClassName('moderator');

    expect(isModeratorClassName.length).toBe(0);
  });
});
