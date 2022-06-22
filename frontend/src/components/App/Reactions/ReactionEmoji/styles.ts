/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const StyledTooltip = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  height: 24px;
  padding: ${space()} ${space(2)};
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(100% + ${space(1.5)});
  border-radius: ${BORDER_RADIUS};

  color: ${COLOR_NEUTRO_100};
  background-color: hsla(0, 59%, 0%, 0.65);
  backdrop-filter: blur(12px);

  transition: opacity 0.3s 0.3s ease-in-out;
  opacity: 0;

  &.show {
    opacity: 1;
  }

  &::before {
    content: '';
    position: absolute;
    bottom: -6px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid hsla(0, 59%, 0%, 0.65);
  }
`;

import { media, space } from '@/ui/helpers';
import { BORDER_RADIUS, COLOR_NEUTRO_100 } from '@/ui/settings';
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

export { StyledEmojiReaction, StyledTooltip };
