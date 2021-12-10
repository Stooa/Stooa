/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { space, media } from '@/ui/helpers';

const NotFoundStyled = styled.div`
  .not-found-img {
    margin-bottom: ${space(4)};
  }
  .title-md,
  .text-lg {
    margin-bottom: ${space()};
  }

  .ctas {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-top: ${space(4)};

    ${media.max('tablet')`
      flex-direction: column;

      > *:first-child { margin-bottom: ${space(2)}; }
    `}

    ${media.min('tablet')`
      > *:first-child { margin-right: ${space(2)}; }
    `}
  }
`;

export default NotFoundStyled;
