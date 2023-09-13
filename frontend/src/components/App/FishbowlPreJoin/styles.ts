/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { COLOR_NEUTRO_100, BORDER_RADIUS, COLOR_NEUTRO_700 } from '@/ui/settings';
import { media, rems, space } from '@/ui/helpers';

const Container = styled.div`
  background-color: ${COLOR_NEUTRO_100};
  border-radius: ${BORDER_RADIUS};
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: ${rems(1024)};

  ${media.min('tablet')`
    flex-direction: row;
    max-height: ${rems(500)};
  `}
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${space(3)} ${space(2)};
  text-align: center;
  width: 100%;

  input {
    margin-bottom: ${space(3)};
  }

  h2 {
    color: ${COLOR_NEUTRO_700};
    margin-bottom: ${space(2)};
  }

  p.subtitle {
    color: ${COLOR_NEUTRO_700};
    margin-bottom: ${space(4)};
  }

  ${media.min('tablet')`
    padding:  ${space(15)} ${space(4)} ${space(6)} ${space(4)};
  `}

  & .cancel {
    position: absolute;
    bottom: ${space(2)};
    left: 50%;
    transform: translateX(-50%);
  }
`;

const VideoContainer = styled.div`
  display: grid;
  align-items: center;
  position: relative;
  border-radius: ${BORDER_RADIUS} ${BORDER_RADIUS} 0 0;
  height: 35vh;
  overflow: hidden;
  width: 100%;
  min-height: 320px;

  .video {
    width: 100%;
    min-height: 100%;
    transform: scaleX(-1);
    z-index: 1;
    object-fit: cover;
  }

  .friend-image {
    object-fit: contain;
  }

  ${media.min('tablet')`
    border-radius: ${BORDER_RADIUS} 0 0 ${BORDER_RADIUS};
    height: 100%;
  `}
`;

export { Container, Devices, DevicesToolbar, Form, VideoContainer };
