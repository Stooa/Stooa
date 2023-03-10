/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import { COLOR_NEUTRO_500 } from '@/ui/settings';
import styled from 'styled-components';

const StyledFeedbackWrapper = styled.div`
  & .feedback {
    margin: ${space(4)} 0;
  }

  & .feedback__title {
    display: flex;
    align-items: baseline;
    gap: ${space()};

    margin-bottom: ${space(0.5)};
  }

  & .feedback__comment {
    margin-bottom: ${space(2)};
  }

  & .feedback__satisfaction {
    width: 80px;
    text-align: center;
    & p {
      text-transform: capitalize;
    }
  }

  & .feedback__separator {
    background-color: ${COLOR_NEUTRO_500};
    border: none;
    height: 1px;
    width: 50%;
    margin-top: ${space(4)};
  }
`;

export { StyledFeedbackWrapper };
