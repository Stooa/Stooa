/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { COLOR_NEUTRO_300 } from '@/ui/settings';
import styled from 'styled-components';

const StyledBlogCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  text-align: left;
  border-radius: 8px;
  flex: 1 1 320px;
  /* border: 1px solid transparent;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  padding: 1em; */

  &:hover {
    cursor: pointer;
    /* background-color: ${COLOR_NEUTRO_300};
    border: 1px solid hsla(0, 0%, 0%, 0.1);
    transition: background-color 0.2s ease-in-out, border-color 0.2s 0.15s ease-out; */
  }

  & .blog-card__image {
    width: 100%;
    object-fit: cover;
    object-position: top;
    border-radius: 8px;
  }
`;

export { StyledBlogCard };
