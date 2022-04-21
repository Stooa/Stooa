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
import typographyData from '@/ui/design-tokens/typography.json';

const typography = typographyData.typography;

/**
 * font-size: 1.25rem;
 */
const BODY_LG = css`
  font-size: ${rems(typography.bodylg.rawFontSize)};
  line-height: ${typography.bodylg.lineHeight};
`;

/**
 * font-size: 1rem;
 */
const BODY_MD = css`
  font-size: ${rems(typography.bodymd.rawFontSize)};
  line-height: ${typography.bodymd.lineHeight};
`;

/**
 * font-size: 0.875rem;
 * Form labels, image captions, tooltips, etc...
 */
const BODY_SM = css`
  font-size: ${rems(typography.bodysm.rawFontSize)};
  line-height: ${typography.bodysm.lineHeight};
`;

/**
 * font-size: 0.75rem;
 * Form labels, image captions, tooltips, etc...
 */
const BODY_XS = css`
  font-size: ${rems(typography.bodyxs.rawFontSize)};
  line-height: ${typography.bodyxs.lineHeight};
`;

/**
 * font-weight: 500;
 */
const mediumWeight = css`
  font-weight: 500;
`;

/**
 * font-weight: 600;
 */
const boldWeight = css`
  font-weight: 600;
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

  .bold {
    font-weight: ${boldWeight};
  }

  .medium {
    font-weight: ${mediumWeight};
  }

  .caps {
    text-transform: uppercase;
  }
`;

export { BODY_LG, BODY_MD, BODY_SM, BODY_XS, boldWeight, mediumWeight };
export default Texts;
