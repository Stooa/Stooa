/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media } from '@/ui/helpers';
import styled from 'styled-components';

const StyledBlogPage = styled.div`
  width: 100%;
  position: relative;
  text-align: left;

  .wave {
    display: block;
    position: absolute;
    width: 100%;
    top: -6.6vw;
    left: 0;
    z-index: 0;
  }
`;

const StyledBlogList = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 4.5rem;
  row-gap: 3em;

  .empty {
    flex: 1 1 320px;
  }
`;

const StyledBlogContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2em;
  width: 100%;
  max-width: 900px;
  padding-block-end: 6em;
  margin-inline: auto;
  z-index: 1;
  padding-inline: 2em;
  padding-block-start: 2em;

  ${media.min('desktop')`
    padding-inline: initial;
  `}
`;

export { StyledBlogPage, StyledBlogList, StyledBlogContainer };
