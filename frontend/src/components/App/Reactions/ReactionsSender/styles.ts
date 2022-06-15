/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FloatFast, FloatStandard } from '@/ui/animations/motion/reactions';
import { media, space } from '@/ui/helpers';
import { COLOR_NEUTRO_100 } from '@/ui/settings';
import styled from 'styled-components';

const ReactionsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 60%;
  left: 50%;
  transform: translateX(-50%);
  line-height: 0;

  background-color: ${COLOR_NEUTRO_100};
  border-radius: 30px;
  box-shadow: 0px 0.9375px 2.8125px 0px rgba(0, 0, 0, 0.15);

  padding: ${space()} ${space(2)};

  & > *:not(:last-child) {
    margin-right: ${space(1.5)};
  }

  ${media.min('tablet')`
    bottom: calc(100% + ${space()});

    `}

  ${media.max('smallestIphone')`
    & > *:not(:last-child) {
      margin-right: 0;
    }
  `}

  &.open {
    animation: open 0.3s;
  }

  &.close {
    animation: close 0.2s ease-out forwards;
  }

  @keyframes open {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes close {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }
`;

const EmojiSpawner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 50%;
  left: 0;
  pointer-events: none;

  overflow: visible;

  ${FloatFast}
  ${FloatStandard}
`;

export { ReactionsWrapper, EmojiSpawner };
