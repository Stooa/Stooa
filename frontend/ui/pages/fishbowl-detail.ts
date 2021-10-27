/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import Alert from 'ui/Alert';
import { BREAKPOINTS } from 'ui/settings';
import { space, rems } from 'ui/helpers';

const Container = styled.div<{ centered?: boolean }>`
  margin: ${space(4)} 0 ${space(2)};
  max-width: ${rems(BREAKPOINTS.reader)};
  text-align: ${({ centered }) => (centered ? 'center' : 'left')};

  dl {
    margin: 0 0 ${space(8)};
  }
`;

const Description = styled.p`
  max-width: ${rems(620)};
  margin: ${space(3)} auto 0;
  text-align: center;
`;

const Time = styled(Alert)`
  display: inline-block;
  margin: ${space(4)} 0;
  padding: ${space(2)} ${space(4)};
`;

const TimeLeft = styled(Alert)`
  margin: ${space(5)} 0 ${space(2)};
`;

export { Container, Description, Time, TimeLeft };
