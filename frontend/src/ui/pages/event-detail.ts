/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { BREAKPOINTS } from '@/ui/settings';
import { space } from '@/ui/helpers';

const Container = styled.div<{ centered?: boolean }>`
  margin-bottom: ${space(2)};
  text-align: ${({ centered }) => (centered ? 'center' : 'left')};
  max-width: ${BREAKPOINTS.desktop}px;
  width: 100%;
`;

const Description = styled.p`
  width: 100%;
  text-align: center;
  word-break: break-word;
`;

const LandingContainer = styled(Container)`
  max-width: ${BREAKPOINTS.reader}px;

  & > * + * {
    margin-top: ${space(5)};
  }
`;

const StyledNarrowerContent = styled.div`
  max-width: ${BREAKPOINTS.form}px;
  margin-inline: auto;

  & > * + * {
    margin-top: ${space(4)};
  }
`;

export { Container, Description, LandingContainer, StyledNarrowerContent };
