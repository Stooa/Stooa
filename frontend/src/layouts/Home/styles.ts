/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { space, media } from '@/ui/helpers';
import Animations from '@/ui/Animations';
import {
  Main as MainDefault,
  Container as ContainerDefault,
  Header as HeaderDefault
} from '@/layouts/Default/styles';
import { COLOR_NEUTRO_100 } from '@/ui/settings';

const Container = styled(ContainerDefault)`
  background-color: ${COLOR_NEUTRO_100};
  position: relative;
  padding-bottom: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;

  ${Animations};
`;

const Header = styled(HeaderDefault)`
  padding: 0 ${space(3)};

  ${media.min('tablet')`
    padding: ${space(3)} ${space(6)};
  `}
`;

const Main = styled(MainDefault)`
  padding-bottom: 0 !important;
`;

export { Container, Header, Main };
