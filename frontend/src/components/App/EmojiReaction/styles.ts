/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

const StyledEmojiReaction = styled.div`
  cursor: pointer;
  user-select: none;
  transition: transform 0.1s ease-out;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  & > * {
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-6px) scale(var(--emojiScale));
  }
`;

export { StyledEmojiReaction };
