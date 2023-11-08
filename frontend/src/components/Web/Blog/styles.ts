/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { TITLE_LG, TITLE_SM } from '@/ui/Titles';
import { space } from '@/ui/helpers';
import {
  BREAKPOINTS,
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700
} from '@/ui/settings';
import styled from 'styled-components';

const StyledBlogWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  padding-top: ${space(8)};

  text-align: left;
  max-width: max(45vw, ${BREAKPOINTS.tablet}px);
`;

const StyledPostTitle = styled.h1`
  ${TITLE_LG};
  width: 100%;
  text-align: center;
`;

const StyledPostSubtitle = styled.h2`
  ${TITLE_SM};
  color: ${COLOR_NEUTRO_600};
`;

const StyledPostContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 700px;
  width: 100%;
`;

const StyledPostContent = styled.div`
  font-size: 1.125rem;
  line-height: 1.5;
`;

const StyledBlogPostInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  width: 100%;

  & > .post-info--author {
    flex: 1;
  }

  & .post-info--share {
    display: flex;
    gap: 1rem;
    align-items: center;

    & a {
      display: flex;
      align-items: center;
      padding: 4px;
      color: ${COLOR_NEUTRO_200};
      background-color: ${COLOR_NEUTRO_700};
      border-radius: 50%;
      width: 20px;
      height: 20px;

      &:hover {
        color: ${COLOR_NEUTRO_300};
      }

      & svg path {
        fill: currentColor;
      }
    }

    & > div {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
`;

export {
  StyledPostTitle,
  StyledPostSubtitle,
  StyledBlogWrapper,
  StyledPostContentWrapper,
  StyledPostContent,
  StyledBlogPostInfo
};
