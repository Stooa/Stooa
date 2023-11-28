/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { TITLE_MD, TITLE_SM } from '@/ui/Titles';
import { media } from '@/ui/helpers';
import { COLOR_NEUTRO_300, COLOR_NEUTRO_600 } from '@/ui/settings';
import Link from 'next/link';
import styled from 'styled-components';

const StyledBlogCard = styled.div`
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

const StyledLinkCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  text-align: left;

  &:hover {
    color: inherit;
  }

  &:hover h3 {
    color: ${COLOR_NEUTRO_600};
  }
`;

const StyledCardTitle = styled.h3`
  ${TITLE_MD};
  font-weight: 500;

  ${media.min('tablet')`
    ${TITLE_SM}
  `}
`;

export { StyledBlogCard, StyledLinkCard, StyledCardTitle };
