/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BODY_LG } from '@/ui/Texts';
import { TITLE_LG, TITLE_SM } from '@/ui/Titles';
import { media, space } from '@/ui/helpers';
import {
  BREAKPOINTS,
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  COLOR_NEUTRO_800
} from '@/ui/settings';
import styled from 'styled-components';

const StyledBlogWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  margin-bottom: 4rem;

  text-align: left;
  max-width: max(45vw, ${BREAKPOINTS.tablet}px);

  & .green-blob,
  .purple-blob,
  .yellow-blob,
  .red-blob {
    position: absolute;
    z-index: -1;
  }

  & .green-blob {
    bottom: 20%;
    left: -180px;
  }

  & .purple-blob {
    top: 5%;
    right: -40px;
  }

  & .yellow-blob {
    top: 20%;
    left: 0;
  }

  & .red-blob {
    bottom: 35%;
    right: -90px;
    transform: translateX(50%);
  }

  ${media.max('desktop')`
    & .green-blob,
    .purple-blob,
    .yellow-blob,
    .red-blob {
      display: none;
    }
  `}
`;

const StyledPostTitle = styled.h1`
  ${TITLE_LG};
  width: 100%;
  text-align: center;
  max-width: 1000px;
  padding: 0 1rem;
  padding-top: ${space(6)};
  margin-bottom: ${space(4)};
`;

const StyledPostSubtitle = styled.h2`
  ${TITLE_SM};
  color: ${COLOR_NEUTRO_600};

  ${media.max('desktop')`
    text-align: center;
  `}
`;

const StyledPostContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 700px;
  width: 100%;

  ${media.max('desktop')`
    padding: 0 1rem;
  `}
`;

const StyledPostContent = styled.div`
  font-size: 1.125rem;
  line-height: 1.8;
  overflow: hidden;
  color: ${COLOR_NEUTRO_800};

  & h2 {
    font-size: 1.5rem;
    font-weight: 400;
    color: ${COLOR_NEUTRO_600};
  }

  & h3 {
    ${BODY_LG};
    color: ${COLOR_NEUTRO_600};
    font-weight: 400;
    font-size: 1.125rem;
  }

  & .image-container {
    position: relative;
    aspect-ratio: 16 / 9;
    width: 100%;
    margin-block: 2rem;

    & img {
      object-fit: cover;
      border-radius: 8px;
    }
  }

  & a {
    --fontSize: inherit;
  }

  & section + section {
    margin-top: 2rem;
  }

  & section > * + * {
    margin-top: 1rem;
  }

  & section[id] {
    scroll-margin-top: 5vh;
  }

  & ol {
    padding-left: 1.5rem;
    list-style: decimal;
  }

  & .schedule-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-block-start: 1rem;
  }

  & .article-reference {
    margin-top: 1.5rem;
    font-style: italic;
  }
`;

const StyledBlogPostInfo = styled.div<{ bottom?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  width: 100%;

  ${media.min('desktop')`
    flex-direction: ${({ bottom }) => (bottom ? 'column' : 'row')};
    align-items: ${({ bottom }) => (bottom ? 'flex-start' : 'center')};
  `}

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

const StyledAnchorMenu = styled.ul`
  position: fixed;
  left: 4vw;
  top: 40vh;
  list-style: none;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
  color: ${COLOR_NEUTRO_600};
  max-width: 20ch;

  & a {
    --fontSize: 16px;
  }

  & li.active {
    color: ${COLOR_NEUTRO_800};
  }

  ${media.max('desktopLarge')`
    display: none;
  `}
`;

export {
  StyledPostTitle,
  StyledPostSubtitle,
  StyledBlogWrapper,
  StyledPostContentWrapper,
  StyledPostContent,
  StyledBlogPostInfo,
  StyledAnchorMenu
};
