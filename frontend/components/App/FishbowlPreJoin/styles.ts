/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { COLOR_NEUTRO_100, BORDER_RADIUS } from 'ui/settings';
import { rems, space } from 'ui/helpers';

const Container = styled.div`
  background-color: ${COLOR_NEUTRO_100};
  border-radius: ${BORDER_RADIUS};
  display: flex;
  flex: 1;
  max-height: ${rems(480)};
  max-width: ${rems(840)};
`;

const Devices = styled.div`
  position: relative;
  width: 100%;
`;

const DevicesToolbar = styled.div`
  align-items: flex-start;
  bottom: ${space(2)};
  display: flex;
  justify-content: center;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  z-index: 2;
`;

const Form = styled.div`
  padding: ${space(6)};
  text-align: center;
  width: 100%;
`;

const VideoContainer = styled.div`
  border-radius: ${BORDER_RADIUS} 0 0 ${BORDER_RADIUS};
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;

  .video {
    width: 100%;
    left: 50%;
    min-height: 100%;
    position: absolute;
    top: 0;
    transform: translateX(-50%) scaleX(-1);
    z-index: 1;
    object-fit: cover;
  }
`;

export { Container, Devices, DevicesToolbar, Form, VideoContainer };
