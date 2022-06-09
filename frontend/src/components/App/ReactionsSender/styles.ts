/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import { COLOR_NEUTRO_100, COLOR_NEUTRO_300 } from '@/ui/settings';
import styled from 'styled-components';

const ReactionsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  position: absolute;
  bottom: calc(100% + ${space()});
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

  &.open {
    animation-duration: 0.3s;
    animation-name: open;
  }

  &.close {
    animation-duration: 0.2s;
    animation-name: close;
    animation-timing-function: ease-out;
    animation-direction: alternate;
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
  width: 100vw;
  height: 100%;
  bottom: 80%;
  left: 50%;
  transform: translateX(-50%);

  overflow: visible;

  & > .emoji {
    animation: float 2s ease-out forwards;
  }

  @keyframes float {
    from {
      transform: translateY(-0.5px);
      opacity: 1;
    }

    to {
      transform: translateY(-100.5px);
      opacity: 0;
    }
  }
`;

export { ReactionsWrapper, EmojiSpawner };
