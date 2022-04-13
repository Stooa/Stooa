/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { css } from 'styled-components';

import { rems } from '@/ui/helpers';
import { FONT_BASE_SIZE } from '@/ui/settings';
import typographyData from '@/ui/figma-tokens/typography.json';

const typography = typographyData.typography;

const BODY_LG = css`
  font-size: ${rems(typography.bodylg.rawFontSize)};
  line-height: ${typography.bodylg.lineHeight};
`;

const BODY_MD = css`
  font-size: ${rems(typography.bodymd.rawFontSize)};
  line-height: ${typography.bodymd.lineHeight};
`;

const BODY_SM = css`
  font-size: ${rems(typography.bodysm.rawFontSize)};
  line-height: ${typography.bodysm.lineHeight};
`;

const BODY_XS = css`
  font-size: ${rems(typography.bodyxs.rawFontSize)};
  line-height: ${typography.bodyxs.lineHeight};
`;

// TODO
const APP_MD = css`
  font-size: 14px;
  line-height: 1.2857;
`;

const APP_SM = css`
  font-size: 12px;
  line-height: 1.5;
`;

const Texts = css`
  .body-lg {
    ${BODY_LG}
  }

  .body-md {
    ${BODY_MD}
  }

  .body-sm {
    ${BODY_SM}
  }

  .body-xs {
    ${BODY_XS}
  }

  .app-lg {
    font-size: 25px;
    font-weight: 500;
    line-height: 1.2;
  }

  .app-md {
    ${APP_MD}
  }

  .app-sm {
    ${APP_SM}
  }

  .app-sm-caps {
    font-size: 11px;
    font-weight: 500;
    line-height: 1.2727;
    text-transform: uppercase;
  }

  .bold {
    font-weight: 600;
  }
  .medium {
    font-weight: 500;
  }

  .bold,
  .medium {
    letter-spacing: 0.15px;
  }

  .caps {
    text-transform: uppercase;
  }
`;

export { APP_SM, APP_MD, BODY_LG, BODY_MD, BODY_SM, BODY_XS };
export default Texts;
