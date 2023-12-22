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
import { space, rems, media } from '@/ui/helpers';
import {
  COLOR_NEUTRO_100,
  COLOR_PURPLE_400,
  COLOR_PURPLE_500,
  COLOR_PURPLE_800
} from '@/ui/settings';

const ThankYouStyled = styled.div`
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

      &:hover {
        background: ${COLOR_PURPLE_400};
      }
    }

    svg path {
      fill: ${COLOR_NEUTRO_100};
    }
  }

  .action-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: ${space(2)};

    & .past-title {
      margin-bottom: ${space(2)};
      color: ${COLOR_PURPLE_500};
    }

    ${media.min('tablet')`
      flex-direction: row;
      column-gap: ${space(3)};
    `}
  }
`;

const Description = styled.p`
  max-width: ${rems(620)};
  margin-inline: auto;
  text-align: center;
`;

const Time = styled(Alert)`
  display: inline-block;
  margin-bottom: ${space(2)};
  padding: ${space(2)} ${space(4)};
`;

const StyledThankyouWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${space(3.5)};
  max-width: 1024px;
  width: 100%;

  h1 {
    margin-bottom: ${space(2)};
  }

  .description {
    margin-bottom: ${space(3)};
  }
`;

export { Description, Time, StyledThankyouWrapper };
export default ThankYouStyled;
