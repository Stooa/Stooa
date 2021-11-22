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
  COLOR_RED_400,
  COLOR_RED_500
} from 'ui/settings';
import { APP_SM, APP_MD, TEXT_SM, TEXT_MD } from 'ui/Texts';
import { rems, space } from 'ui/helpers';

const buttonStyles = css`
  ${TEXT_MD}

  align-items: center;
  background: ${COLOR_PURPLE_500};
  border: 2px solid ${COLOR_PURPLE_500};
  border-radius: ${space(3)};
  color: ${COLOR_NEUTRO_100};
  cursor: pointer;
  display: inline-flex;
  font-weight: 500;
  justify-content: center;
  line-height: ${rems(20)};
  letter-spacing: 0.15px;
  min-width: ${rems(20)};
  padding: ${space(1.85)} ${space(4)} ${space(1.65)};
  text-decoration: none;
  transition: 0.1s ease-out;
  will-change: background, color;

  &:disabled {
    background: ${COLOR_NEUTRO_300} !important;
    border-color: ${COLOR_NEUTRO_300} !important;
    color: ${COLOR_NEUTRO_500} !important;
    pointer-events: none;
  }

  svg {
    margin-left: ${space(0.75)};
    width: ${space(2)};

    path {
      fill: currentColor;
    }
  }

  &.secondary {
    background: ${COLOR_PURPLE_200};
    border-color: ${COLOR_PURPLE_200};
    color: ${COLOR_PURPLE_500};
  }

  &:hover {
    background: ${COLOR_PURPLE_400};
    border-color: ${COLOR_PURPLE_400};
    color: ${COLOR_NEUTRO_100};
  }
`;

const Button = styled.button<{ full?: boolean }>`
  width: ${({ full }) => (full ? '100%' : 'auto')};
  ${buttonStyles};
`;

const ButtonSmall = styled(Button)`
  ${TEXT_SM}

  border-width: 1px;
  padding: ${space(1.1)} ${space(3)} ${space(0.8)};
`;

const ButtonApp = styled(Button)`
  ${APP_MD}

  font-weight: 500;
  padding: ${space(1.1)} ${space(3)} ${space(0.9)};

  &.error {
    background: ${COLOR_RED_500};
    border-color: ${COLOR_RED_500};

    &:hover {
      background: ${COLOR_RED_400};
      border-color: ${COLOR_RED_400};
    }
  }
`;

const ButtonAppSmall = styled(ButtonApp)`
  ${APP_SM}

  border-width: 1px;
`;

const ButtonHollow = styled(Button)`
  background: transparent;
  color: ${COLOR_PURPLE_500};
`;

const ButtonTransp = styled.button`
  align-items: center;
  color: ${COLOR_PURPLE_500};
  cursor: pointer;
  display: inline-flex;
  font-weight: 500;
  justify-content: center;
  padding: ${space(1.85)} ${space(3)} ${space(1.65)};
  text-decoration: none;
  transition: color 0.1s ease-out;
  will-change: color;

  &:hover {
    color: ${COLOR_PURPLE_400};
  }
`;

const linkStyles = css`
  cursor: pointer;
  text-decoration: underline;
`;

const ButtonLink = styled.button`
  ${linkStyles}
`;

const ButtonStyledLink = styled.a<{ full?: boolean }>`
  width: ${({ full }) => (full ? '100%' : 'auto')};
  ${buttonStyles};
`;

const ButtonStyledLinkSmall = styled(ButtonStyledLink)`
  ${TEXT_SM}

  border-width: 1px;
  padding: ${space(1.1)} ${space(3)} ${space(0.8)};
`;

const StyledLink = styled.a`
  ${linkStyles}
`;

const ButtonLinkApp = styled.button`
  ${APP_MD}
  ${linkStyles}
`;

export {
  ButtonApp,
  ButtonAppSmall,
  ButtonHollow,
  ButtonSmall,
  ButtonTransp,
  ButtonLink,
  ButtonLinkApp,
  ButtonStyledLink,
  ButtonStyledLinkSmall,
  StyledLink
};
export default Button;
