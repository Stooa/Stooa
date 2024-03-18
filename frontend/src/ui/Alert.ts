/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled, { css } from 'styled-components';

import { space } from '@/ui/helpers';
import {
  BORDER_RADIUS,
  COLOR_GREEN_100,
  COLOR_GREEN_200,
  COLOR_GREEN_900,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_500,
  COLOR_NEUTRO_700,
  COLOR_RED_100,
  COLOR_RED_200,
  COLOR_RED_900,
  COLOR_YELLOW_100,
  COLOR_YELLOW_300
} from '@/ui/settings';
import { BODY_SM, BODY_LG } from '@/ui/Texts';

const ERROR_STYLES = css`
  background: ${COLOR_RED_100};
  border: 1px solid ${COLOR_RED_200};
  color: ${COLOR_RED_900};

  svg > path {
    fill: ${COLOR_RED_900};
  }
`;

const HIGHLIGHT_STYLES = css`
  background: ${COLOR_NEUTRO_100};
  border: 1px solid ${COLOR_NEUTRO_400};
  color: ${COLOR_NEUTRO_700};
`;

const WARNING_STYLES = css`
  background: ${COLOR_YELLOW_100};
  border: 1px solid ${COLOR_YELLOW_300};
  color: ${COLOR_NEUTRO_700};
`;

const SUCCESS_STYLES = css`
  background: ${COLOR_GREEN_100};
  border: 1px solid ${COLOR_GREEN_200};
  color: ${COLOR_GREEN_900};

  svg > path {
    fill: ${COLOR_GREEN_900};
  }
`;

const INFO_STYLES = css`
  background: ${COLOR_NEUTRO_100};
  border: 1px solid ${COLOR_NEUTRO_500};
  color: ${COLOR_NEUTRO_700};
`;

const Alert = styled.div<{ block?: boolean }>`
  ${BODY_SM}

  align-items: center;
  border-radius: ${BORDER_RADIUS};
  color: ${COLOR_NEUTRO_700};
  display: ${({ block }) => (block ? 'block' : 'flex')};
  justify-content: center;
  margin-inline: auto;
  overflow-x: auto;
  padding: ${space(1.125)} ${space(1.5)} ${space(0.875)};
  text-align: center;

  &.info {
    ${INFO_STYLES}
  }

  &.error {
    ${ERROR_STYLES}
  }

  &.success {
    ${SUCCESS_STYLES}
  }

  &.highlight {
    ${HIGHLIGHT_STYLES}
  }

  &.warning {
    ${WARNING_STYLES}
  }

  &.lg {
    ${BODY_LG}

    padding: ${space(2)} ${space(4)};
  }
`;

export { ERROR_STYLES, SUCCESS_STYLES, HIGHLIGHT_STYLES, WARNING_STYLES };
export default Alert;
