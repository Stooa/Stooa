/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media, space } from '@/ui/helpers';
import { BORDER_RADIUS, COLOR_NEUTRO_100, COLOR_NEUTRO_400, COLOR_NEUTRO_700 } from '@/ui/settings';
import styled from 'styled-components';

const StyledRecordingStatus = styled.div`
  display: flex;
  align-items: center;
  color: ${COLOR_NEUTRO_700};
  background-color: ${COLOR_NEUTRO_100};
  border: 1px solid ${COLOR_NEUTRO_400};
  border-radius: ${BORDER_RADIUS};
  line-height: 1.33;
  padding: ${space(1.25)} ${space(1.5)} ${space(0.875)} ${space(1)};
  transition: transform 0.3s cubic-bezier(0.85, -0.265, 0.215, 1.225);

  &.show {
    transition: transform 1s 0.3s cubic-bezier(0.85, -0.265, 0.215, 1.225);
    transform: translate(0, 0);
  }

  &.moderator {
    padding: ${space(1.125)} ${space(1)} ${space(0.875)} ${space(1.5)};

    & button {
      display: flex;
      align-items: center;
      position: relative;

      & svg {
        transition: transform 0.2s ease-out;
      }

      &:hover svg {
        transform-origin: center;
        transform: scale(1.12);
      }
    }

    & > svg {
      margin-left: ${space(0.5)};
    }
  }

  &:not(.moderator) > svg {
    margin-right: ${space(0.5)};

    & path {
      transform-origin: center;
      animation: expand 2.5s 0.35s ease-in-out infinite;
    }

    & circle {
      transform-origin: center;
      animation: breathe 2.5s ease-in-out infinite;
    }

    @keyframes breathe {
      0% {
        transform: scale(1.2);
      }
      40% {
        transform: scale(0.8);
      }
      100% {
        transform: scale(1.2);
      }
    }

    @keyframes expand {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      45% {
        transform: scale(1.2);
        opacity: 0;
      }
      99% {
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  }

  ${media.min('tablet')`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -300px);

    &.show {
      transform: translate(-50%, -50%);
    }
  `}
`;

export { StyledRecordingStatus };
