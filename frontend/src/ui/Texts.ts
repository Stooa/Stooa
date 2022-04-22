/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled, { css } from 'styled-components';

import { rems } from '@/ui/helpers';
import typographyData from '@/ui/design-tokens/typography.json';
import {
  COLOR_NEUTRO_500,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  COLOR_NEUTRO_800,
  COLOR_PURPLE_400,
  COLOR_PURPLE_500,
  COLOR_PURPLE_600
} from './settings';

const typography = typographyData.typography;

const TYPOGRAPHY_SIZES = {
  body_lg: {
    fontSize: rems(typography.bodylg.rawFontSize),
    lineHeight: typography.bodylg.lineHeight
  },
  body_md: {
    fontSize: rems(typography.bodymd.rawFontSize),
    lineHeight: typography.bodymd.lineHeight
  },
  body_sm: {
    fontSize: rems(typography.bodysm.rawFontSize),
    lineHeight: typography.bodysm.lineHeight
  },
  body_xs: {
    fontSize: rems(typography.bodyxs.rawFontSize),
    lineHeight: typography.bodyxs.lineHeight
  },
  link: {
    fontSize: rems(typography.link.rawFontSize),
    lineHeight: typography.link.lineHeight
  }
};

/**
 * font-size: 1.25rem;
 */
const BODY_LG = css`
  font-size: ${TYPOGRAPHY_SIZES.body_lg.fontSize};
  line-height: ${TYPOGRAPHY_SIZES.body_lg.lineHeight};
`;

/**
 * font-size: 1rem;
 */
const BODY_MD = css`
  font-size: ${TYPOGRAPHY_SIZES.body_md.fontSize};
  line-height: ${TYPOGRAPHY_SIZES.body_md.lineHeight};
`;

/**
 * font-size: 0.875rem;
 * Form labels, image captions, tooltips, etc...
 */
const BODY_SM = css`
  font-size: ${TYPOGRAPHY_SIZES.body_sm.fontSize};
  line-height: ${TYPOGRAPHY_SIZES.body_sm.lineHeight};
`;

/**
 * font-size: 0.75rem;
 * Form labels, image captions, tooltips, etc...
 */
const BODY_XS = css`
  font-size: ${TYPOGRAPHY_SIZES.body_xs.fontSize};
  line-height: ${TYPOGRAPHY_SIZES.body_xs.lineHeight};
`;

const LINK_STYLE = css`
  font-size: ${TYPOGRAPHY_SIZES.link.fontSize};
  line-height: ${TYPOGRAPHY_SIZES.link.lineHeight};
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
    ${boldWeight};
  }

  .medium {
    ${mediumWeight};
  }

  .caps {
    text-transform: uppercase;
  }
`;

const StyledLink = styled.a<{ subtle?: boolean }>`
  ${LINK_STYLE}
  color: ${({ subtle }) => (subtle ? COLOR_NEUTRO_700 : COLOR_PURPLE_500)};
  text-decoration: underline;

  &:hover {
    color: ${({ subtle }) => (subtle ? COLOR_NEUTRO_600 : COLOR_PURPLE_400)};
  }

  &:focus {
    color: ${({ subtle }) => (subtle ? COLOR_NEUTRO_800 : COLOR_PURPLE_600)};
  }
`;

export {
  BODY_LG,
  BODY_MD,
  BODY_SM,
  BODY_XS,
  boldWeight,
  mediumWeight,
  TYPOGRAPHY_SIZES,
  StyledLink
};
export default Texts;
