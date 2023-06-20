/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { rems, space } from '@/ui/helpers';
import { COLOR_RED_500 } from '@/ui/settings';
import { BODY_SM, BODY_XS } from '@/ui/Texts';

const ValidationError = styled.div`
  ${BODY_XS};

  width: 100%;
  color: ${COLOR_RED_500};
  margin-top: ${space(0.5)};
  padding: 0 ${space(2)};

  text-align: left;
`;

const ValidationIcon = styled.div`
  height: ${rems(16)};
  position: absolute;
  right: ${space(2)};
  top: ${space(2)};
  width: ${rems(16)};
`;

export { ValidationError, ValidationIcon };
