/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import {
  BREAKPOINTS,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_500,
  COLOR_PURPLE_200,
  COLOR_PURPLE_400,
  COLOR_PURPLE_500,
  COLOR_PURPLE_600,
  COLOR_PURPLE_700,
  COLOR_RED_400,
  COLOR_RED_500,
  COLOR_RED_600
} from '@/ui/settings';
import { mediumWeight, TYPOGRAPHY_SIZES } from '@/ui/Texts';
import { media, space } from '@/ui/helpers';
import { StyledLinkCss } from './Globals';

const SIZES = {
  small: {
    '--padding': `${space(1)} ${space(3)} ${space(0.75)} ${space(3)}`,
    '--fontSize': `${TYPOGRAPHY_SIZES.body_sm.fontSize}`,
    '--lineHeight': `${TYPOGRAPHY_SIZES.body_sm.lineHeight}`
  },
  medium: {
    '--padding': `${space(1)} ${space(3)} ${space(0.875)} ${space(3)}`,
    '--fontSize': `${TYPOGRAPHY_SIZES.body_sm.fontSize}`,
    '--lineHeight': `${TYPOGRAPHY_SIZES.body_sm.lineHeight}`
  },
  large: {
    '--padding': `${space(1.75)} ${space(4)} ${space(1.5)} ${space(4)}`,
    '--fontSize': `${TYPOGRAPHY_SIZES.body_md.fontSize}`,
    '--lineHeight': `${TYPOGRAPHY_SIZES.body_md.lineHeight}`
  }
};

const ButtonBase = styled.button<{ full?: boolean }>`
  ${mediumWeight};
  width: 100%;

  @media (min-width: ${BREAKPOINTS.tablet}px) {
    width: ${({ full }) => (full ? '100%' : 'auto')};
  }

  align-items: center;
  border: none;
  border-radius: ${space(3)};
  cursor: pointer;
  display: inline-flex;
  font-size: var(--fontSize);
  justify-content: center;
  line-height: var(--lineHeight);
  padding: var(--padding);
  position: relative;
  text-decoration: none;
  transition: 0.1s ease-out;
  will-change: background, color;

  &.never-full {
    width: auto;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: ${COLOR_NEUTRO_300};
    color: ${COLOR_NEUTRO_500};
    pointer-events: none;
  }

  & > * + svg {
    &:first-child {
      margin-left: ${space(0.75)};
    }

    ${media.min('tablet')`
      margin-left: ${space(0.75)};
      margin-right: ${space(-0.75)};
      width: ${space(2)};
    `}

    path {
      fill: currentColor;
    }
  }

  &.error {
    background-color: ${COLOR_RED_500};

    &:hover {
      background-color: ${COLOR_RED_400};
    }

    &:focus {
      background-color: ${COLOR_RED_600};
    }
  }

  & div.alert {
    position: absolute;
    right: 0;
    top: 0;
  }
`;

const PrimaryButton = styled(ButtonBase)`
  background-color: ${COLOR_PURPLE_500};
  color: ${COLOR_NEUTRO_100};

  &:hover {
    color: ${COLOR_NEUTRO_100};
    background-color: ${COLOR_PURPLE_400};
  }

  &:focus {
    color: ${COLOR_NEUTRO_100};
    background-color: ${COLOR_PURPLE_600};
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background-color: ${COLOR_PURPLE_200};
  color: ${COLOR_PURPLE_500};

  &:hover {
    color: ${COLOR_NEUTRO_100};
    background-color: ${COLOR_PURPLE_400};
  }

  &:focus {
    color: ${COLOR_NEUTRO_100};
    background-color: ${COLOR_PURPLE_600};
  }
`;

const SecondaryButtonDarker = styled(ButtonBase)`
  background-color: ${COLOR_PURPLE_200};
  color: ${COLOR_PURPLE_500};

  &:hover {
    color: ${COLOR_NEUTRO_100};
    background-color: ${COLOR_PURPLE_500};
  }

  &:focus {
    color: ${COLOR_NEUTRO_100};
    background-color: ${COLOR_PURPLE_700};
  }
`;

const TextButton = styled.button`
  ${mediumWeight};
  color: ${COLOR_PURPLE_500};
  font-size: var(--fontSize);
  line-height: var(--lineHeight);

  &:disabled {
    color: ${COLOR_NEUTRO_500};

    &:hover {
      color: ${COLOR_NEUTRO_500};
      cursor: default;
    }
  }

  &:hover {
    color: ${COLOR_PURPLE_400};
  }

  &:focus {
    color: ${COLOR_PURPLE_600};
  }
`;

const LinkStyledButton = styled.button`
  color: ${COLOR_PURPLE_500};
  font-size: var(--fontSize);
  line-height: var(--lineHeight);
  text-decoration: underline;

  &:hover {
    color: ${COLOR_PURPLE_400};
  }

  &:focus {
    color: ${COLOR_PURPLE_600};
  }

  &:disabled {
    color: ${COLOR_NEUTRO_500};
    pointer-events: none;
  }
`;

const SubtleLinkStyledButton = styled.button`
  ${StyledLinkCss}
  text-decoration: underline;
`;

export {
  PrimaryButton,
  SecondaryButton,
  SecondaryButtonDarker,
  TextButton,
  LinkStyledButton,
  SubtleLinkStyledButton,
  SIZES
};
export default ButtonBase;
