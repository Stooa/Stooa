/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import Alert from '@/ui/Alert';
import { COLOR_NEUTRO_600 } from '@/ui/settings';
import { space } from '@/ui/helpers';
import { BODY_XS } from '@/ui/Texts';

const StatusBox = styled(Alert)`
  ${BODY_XS}

  font-weight: 500;
  padding-left: ${space(1.5)};

  svg {
    height: ${space(3)};
    margin-right: ${space(0.5)};
    width: ${space(3)};

    path {
      fill: ${COLOR_NEUTRO_600};
    }
  }
`;

const IntroductionBanner = styled(Alert)`
  bottom: 100%;
  padding: ${space()} ${space(2)};
  position: absolute;
  transform: translateX(-50%);
`;

const Notifications = styled.div`
  bottom: ${space()};
  padding: 0 ${space(2)};
  pointer-events: none;
  position: absolute;
  width: 100%;
  z-index: 10;
`;

const HackLeaveHover = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background: transparent;
  z-index: 100;
`;

export { Notifications, StatusBox, IntroductionBanner, HackLeaveHover };
