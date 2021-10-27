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
import { space, rems, hover } from 'ui/helpers';
import {
  COLOR_NEUTRO_100,
  COLOR_PURPLE_400,
  COLOR_PURPLE_500,
  COLOR_PURPLE_800,
} from 'ui/settings';

const ThankYouStyled = styled.div`
  margin-top: ${space(9)};

  .share {
    margin-bottom: ${space(4)};

    p {
      color: ${COLOR_PURPLE_800};
    }

    ul {
      align-items: center;
      display: flex;
      justify-content: center;
    }

    a {
      align-items: center;
      background-color: ${COLOR_PURPLE_500};
      border-radius: 50%;
      display: flex;
      justify-content: center;
      height: ${space(4)};
      margin: ${space()} ${space(0.5)};
      transition: 0.1s ease-out;
      width: ${space(4)};

      ${hover`
        background: ${COLOR_PURPLE_400};
      `}
    }

    svg path {
      fill: ${COLOR_NEUTRO_100};
    }
  }
`;

const Description = styled.p`
  max-width: ${rems(620)};
  margin: ${space()} auto 0;
  text-align: center;
`;

const Time = styled(Alert)`
  display: inline-block;
  margin-bottom: ${space(2)};
  padding: ${space(2)} ${space(4)};
`;

export { Description, Time };
export default ThankYouStyled;
