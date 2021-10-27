/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { css } from 'styled-components';

import { rems } from 'ui/helpers';
import { FONT_BASE_SIZE } from 'ui/settings';

const TEXT_LG = css`
  font-size: ${rems(20)};
  line-height: 1.4;
`;

const TEXT_MD = css`
  font-size: ${rems(FONT_BASE_SIZE)};
  line-height: 1.5;
`;

const TEXT_SM = css`
  font-size: ${rems(14)};
  line-height: 1.4;
`;

const TEXT_XXS = css`
  font-size: ${rems(12)};
  line-height: 1;
`;

const APP_MD = css`
  font-size: 14px;
  line-height: 1.2857;
`;

const APP_SM = css`
  font-size: 12px;
  line-height: 1.5;
`;

const Texts = css`
  .text-lg {
    ${TEXT_LG}
  }

  .text-md {
    ${TEXT_MD}
  }

  .text-sm {
    ${TEXT_SM}
  }

  .text-xxs {
    ${TEXT_XXS}
  }

  .app-lg {
    font-size: 25px
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
    font-size: 11px:
    font-weight: 500;
    line-heignt: 1.2727;
    text-transform: uppercase;
  }

  .bold { font-weight: 600; }
  .medium { font-weight: 500; }

  .bold,
  .medium {
    letter-spacing: .15px;
  }

  .caps { text-transform: uppercase; }
`;

export { APP_SM, APP_MD, TEXT_LG, TEXT_MD, TEXT_SM, TEXT_XXS };
export default Texts;
