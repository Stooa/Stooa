/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import Modal from '@/ui/Modal';
import styled from 'styled-components';

const StyledIntroModal = styled(Modal)`
  & .content {
    max-width: 90%;
  }

  & .description {
    margin-bottom: ${space(4)};

    &.share {
      display: flex;
      margin-top: ${space(4)};

      & > div {
        max-width: 270px;

        & > img {
          margin-inline: auto;
          object-fit: contain;
        }

        &:not(:last-child) {
          margin-right: ${space(8)};
        }

        & > p {
          margin-top: ${space(4)};
        }
      }
    }
  }
`;

export { StyledIntroModal };
