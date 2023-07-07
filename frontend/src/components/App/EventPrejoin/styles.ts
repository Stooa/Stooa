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

const StyledPrejoinFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${space(2)} ${space(2)};
  text-align: center;
  width: 100%;
  color: ${COLOR_NEUTRO_700};
  gap: ${space(2)};

  ${media.min('tablet')`
    min-height: 520px;
    padding: ${space(6)} ${space(4)};
  `}
`;

const VideoContainer = styled.div`
  display: grid;
  align-items: center;
  position: relative;
  border-radius: ${BORDER_RADIUS} ${BORDER_RADIUS} 0 0;
  height: 35vh;
  overflow: hidden;
  width: 100%;
  min-height: 220px;

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
    min-height: 320px;
    height: 100%;
  `}
`;

const StyledFormWrapper = styled.div`
  width: 100%;
  padding-inline: ${space(4)};

  & > * + * {
    margin-top: ${space(4)};
  }
`;

const StyledPrejoinForm = styled.form`
  & > * + * {
    margin-top: ${space(4)};
  }
`;

export {
  Container,
  Devices,
  DevicesToolbar,
  StyledPrejoinFormWrapper,
  VideoContainer,
  StyledFormWrapper,
  StyledPrejoinForm
};
