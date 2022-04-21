/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled, { css } from 'styled-components';

import {
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_500,
  COLOR_PURPLE_200,
  COLOR_PURPLE_400,
  COLOR_PURPLE_500,
  COLOR_PURPLE_600,
  COLOR_RED_400,
  COLOR_RED_500,
  COLOR_RED_600
} from '@/ui/settings';
import { BODY_XS, BODY_MD, BODY_SM, mediumWeight } from '@/ui/Texts';
import { rems, space } from '@/ui/helpers';

const SIZES = {
  small: {
    '--padding': `${space(1)} ${space(3)} ${space(0.875)} ${space(3)}`,
    '--fontSize': `${BODY_XS}`
  },
  medium: {
    '--padding': `${space(1.5)} ${space(4)} ${space(1.25)} ${space(4)}`,
    '--fontSize': `${BODY_MD}`
  },
  large: {
    '--padding': `${space(1)} ${space(3)} ${space(0.875)} ${space(3)}`,
    '--fontSize': `${BODY_MD}`
  }
};

const ButtonBase = styled.button<{ full?: boolean }>`
  width: ${({ full }) => (full ? '100%' : 'auto')};
  ${mediumWeight};

  align-items: center;
  border: none;
  border-radius: ${space(3)};
  cursor: pointer;
  display: inline-flex;
  font-size: var(--fontSize);
  justify-content: center;
  /* line-height: ${rems(20)}; */
  /* min-width: ${rems(20)}; */
  padding: var(--padding);
  text-decoration: none;
  transition: 0.1s ease-out;
  will-change: background, color;

  &:disabled {
    cursor: not-allowed;
    background-color: ${COLOR_NEUTRO_300};
    color: ${COLOR_NEUTRO_500};
    pointer-events: none;
  }

  svg {
    margin-left: ${space(0.75)};
    width: ${space(2)};

    path {
      fill: currentColor;
    }
  }

  &.error {
    background-color: ${COLOR_RED_500};
    border-color: ${COLOR_RED_500};

    &:hover {
      background-color: ${COLOR_RED_400};
      border-color: ${COLOR_RED_400};
    }

    &:focus {
      background-color: ${COLOR_RED_600};
    }
  }
`;

const PrimaryButton = styled(ButtonBase)`
  background-color: ${COLOR_PURPLE_500};
  color: ${COLOR_NEUTRO_100};

  &:hover {
    background-color: ${COLOR_PURPLE_400};
  }

  &:focus {
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

const TextButton = styled.button`
  color: ${COLOR_PURPLE_500};

  &:hover {
    color: ${COLOR_PURPLE_400};
  }

  &:focus {
    color: ${COLOR_PURPLE_600};
  }
`;

const linkStyles = css`
  cursor: pointer;
  text-decoration: underline;
`;

const coloredLinkStyles = css`
  cursor: pointer;
  color: ${COLOR_PURPLE_500};
  font-weight: 500;
`;

const ButtonLink = styled.button`
  ${linkStyles}
`;

const ButtonStyledLink = styled.a<{ full?: boolean }>`
  width: ${({ full }) => (full ? '100%' : 'auto')};
  ${ButtonBase};
`;

const ButtonStyledLinkSmall = styled(ButtonStyledLink)`
  ${BODY_SM}
`;

const ButtonLinkApp = styled.button`
  ${BODY_SM}
  ${linkStyles}
`;

const ButtonLinkColored = styled.button`
  ${coloredLinkStyles}
  ${BODY_SM}
`;

export {
  PrimaryButton,
  SecondaryButton,
  TextButton,
  ButtonLink,
  ButtonLinkApp,
  ButtonStyledLink,
  ButtonStyledLinkSmall,
  ButtonLinkColored,
  SIZES
};
export default ButtonBase;
