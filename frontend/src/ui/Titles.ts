/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { css } from 'styled-components';

import { media, rems } from '@/ui/helpers';
import typographyData from '@/ui/design-tokens/typography.json';

const typography = typographyData.typography;

const TITLE_DISPLAY = css`
  font-size: ${rems(typography.mobileDisplay.rawFontSize)};
  line-height: ${typography.mobileDisplay.lineHeight};
  font-weight: 700;

  ${media.min('tablet')`
  font-size: ${rems(typography.desktopDisplay.rawFontSize)};
  line-height: ${typography.desktopDisplay.lineHeight};
  `}
`;

const TITLE_LG = css`
  font-size: ${rems(typography.mobileTitlelg.rawFontSize)};
  line-height: ${typography.mobileTitlelg.lineHeight};
  font-weight: 700;

  ${media.min('tablet')`
    font-size: ${rems(typography.desktopTitlelg.rawFontSize)};
    line-height: ${typography.desktopTitlelg.lineHeight};
  `}
`;

const TITLE_MD = css`
  font-size: ${rems(typography.mobileTitlemd.rawFontSize)};
  line-height: ${typography.mobileTitlemd.lineHeight};
  font-weight: 700;

  ${media.min('tablet')`
    font-size: ${rems(typography.desktopTitlemd.rawFontSize)};
    line-height: ${typography.desktopTitlemd.lineHeight};
  `}
`;

const TITLE_SM = css`
  font-size: ${rems(typography.desktopTitlesm.rawFontSize)};
  line-height: ${typography.desktopTitlesm.lineHeight};
  font-weight: 500;

  ${media.min('tablet')`
    font-size: ${rems(typography.desktopTitlesm.rawFontSize)};
    line-height: ${typography.desktopTitlesm.lineHeight};
  `}
`;

const Titles = css`
  .title-display {
    ${TITLE_DISPLAY}
  }

  .title-lg {
    ${TITLE_LG}
  }

  .title-md {
    ${TITLE_MD}
  }

  .title-sm {
    ${TITLE_SM}
  }
`;

export default Titles;
