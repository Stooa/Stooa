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

const Titles = css`
  .title-xl {
    font-size: ${rems(83)};
    font-weight: 600;
    line-height: 1.15;
  }

  .title-lg {
    font-size: ${rems(60)};
    font-weight: 600;
    line-height: 1.15;
  }

  .title-md {
    font-size: ${rems(35)};
    font-weight: 600;
    line-height: 1.142;
  }

  .title-sm {
    font-size: ${rems(14)};
    font-weight: 500;
    letter-spacing: 0.15px;
    line-height: 1.5;
  }
`;

export default Titles;
