/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media } from '@/ui/helpers';
import { COLOR_NEUTRO_100 } from '@/ui/settings';
import styled from 'styled-components';

const StyledBlogBannerCTA = styled.div`
  position: relative;
  width: 100%;
  padding: 4rem 0;
  background-color: ${COLOR_NEUTRO_100};
  z-index: 1;

  & .banner--content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 5.5rem;
    padding-inline: 5rem;

    margin: 0 auto;

    ${media.max('desktop')`
      padding-inline: 1rem;
      gap: 2rem;
    `}
  }

  & .banner--image-title {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: center;
    justify-content: center;

    flex: 0 1 700px;
    text-align: left;

    ${media.max('desktop')`
      flex-direction: column;
      text-align: center;

      & img {
        height: 225px;
        width: 202px;
      }
    `}
  }

  & .banner--cta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    flex: 0 1 400px;
  }
`;

export { StyledBlogBannerCTA };
