/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { COLOR_NEUTRO_700 } from '@/ui/settings';

const LogoStyled = styled.div`
  color: inherit;
  font-size: 26px;
  font-weight: 700;

  &:hover {
    color: inherit;
  }

  &:focus {
    color: ${COLOR_NEUTRO_700};
  }
`;

const LogoAppStyled = styled(LogoStyled)`
  font-size: 20px;
`;

export { LogoAppStyled };
export default LogoStyled;
