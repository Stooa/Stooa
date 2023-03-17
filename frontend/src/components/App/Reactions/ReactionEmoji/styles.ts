/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media } from '@/ui/helpers';

import styled from 'styled-components';

const StyledEmojiReaction = styled.div`
  --translateY: 0;
  --emojiScale: 0.9;

  position: relative;
  cursor: pointer;
  transition: transform 0.15s cubic-bezier(0.22, 1, 0.36, 1);

  transform: translateY(var(--translateY)) scale(var(--emojiScale));

  ${media.min('tablet')`
    --emojiScale: 1;
  `}

  &,
  & > * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    user-select: none;
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  & > * {
    pointer-events: none;
  }

  &:hover {
    --translateY: -6px;
  }
`;

export { StyledEmojiReaction };
