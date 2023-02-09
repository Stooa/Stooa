/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { space, rems, media } from '@/ui/helpers';
import {
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  BORDER_RADIUS,
  COLOR_PURPLE_600
} from '@/ui/settings';

const InfoStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .title {
    max-width: ${rems(340)};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Icon = styled.button`
  display: flex;
  align-items: center;
  margin-left: ${space()};

  svg path {
    fill: ${COLOR_NEUTRO_600};
  }

  .icon-wrapper:hover {
    border-color: currentColor;
  }

  &.active .icon-wrapper {
    border-color: currentColor;
  }
`;

const Description = styled.div`
  background-color: ${COLOR_NEUTRO_100};
  border: 1px solid ${COLOR_NEUTRO_700};
  border-radius: ${BORDER_RADIUS};
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
  color: ${COLOR_NEUTRO_700};
  left: 50%;
  padding: ${space(2)};
  position: fixed;
  top: ${space(15)};
  transform: translateX(-50%);
  width: calc(100% - ${space(4)});
  z-index: 10;

  ${media.min('reader')`
    position: absolute;
    top: 125%;
    left: 0;
    transform: translateX(0);
    min-width: ${rems(340)};
    width: 100%;
  `}

  .description__title {
    margin-bottom: ${space(1)};
  }

  .info-text {
    margin-bottom: ${space(2)};
    max-height: 350px;
    overflow-y: scroll;
  }

  .description__share-text {
    color: ${COLOR_PURPLE_600};
    margin-top: ${space(1)};
  }
`;

export { Icon, Description };
export default InfoStyled;
