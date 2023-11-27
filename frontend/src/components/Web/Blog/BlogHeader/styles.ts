/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { media } from '@/ui/helpers';
import { COLOR_NEUTRO_100, COLOR_PURPLE_400 } from '@/ui/settings';
import styled from 'styled-components';

const StyledBlogHeader = styled.div`
  display: flex;

  justify-content: center;
  align-items: center;
  width: 100%;
  padding-block-start: 10em;
  padding-block-end: 7em;
  background-color: ${COLOR_PURPLE_400};
  color: ${COLOR_NEUTRO_100};

  ${media.min('desktop')`
    padding-block-end: 15em;
  `}
`;

const StyledBlogHeaderContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1em;
  width: 100%;
  max-width: 900px;
  padding-inline: 2em;
  text-align: left;

  p {
    max-width: 50ch;
  }

  & img {
    ${media.max('desktop')`
      display: none;
    `};
  }
`;

const StyledBlogHeaderTitle = styled.div`
  flex: 1 1 600px;
`;

export { StyledBlogHeader, StyledBlogHeaderContent, StyledBlogHeaderTitle };
