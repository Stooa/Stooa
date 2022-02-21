/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';
import {
  BREAKPOINTS,
  COLOR_GREEN_500,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_500,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  COLOR_NEUTRO_800
} from '@/ui/settings';
import { media, rems, space } from '@/ui/helpers';
import { TEXT_LG, TEXT_MD } from '@/ui/Texts';

const FishbowlListWrapper = styled.div`
  height: 100%;
  padding: ${space(3)} 0;
  width: 100%;
  max-width: ${BREAKPOINTS.desktop}px;
`;

const FishbowlListContent = styled.div`
  display: grid;
  width: 100%;

  column-gap: ${space(2)};

  &.half {
    grid-template-columns: 1fr auto;
  }
`;

const FishbowlScrollList = styled.div`
  display: grid;
  position: relative;
  grid-auto-rows: minmax(min-content, max-content);
  row-gap: ${space(2)};
  padding-bottom: ${space(1)};
  align-items: start;
  padding-top: 4px;
  max-height: 800px;

  overflow-y: scroll;
  scrollbar-color: ${COLOR_NEUTRO_400} transparent;

  &::-webkit-scrollbar {
    /* display: none; */
  }

  &::-webkit-scrollbar-thumb {
    /* Foreground */
    background: ${COLOR_NEUTRO_400};
  }

  &::-webkit-scrollbar-track {
    /* Background */
    background: transparent;
  }

  .fishbowl-list__empty-illustration {
    margin: ${space(2)} 0;
    position: relative;
    width: 100%;
    height: ${rems(200)};

    ${media.min('tablet')`
    margin: ${space(6)} 0;`}
  }
`;

const EmptyFishbowlList = styled.div`
  .fishbowl-list__empty-illustration {
    display: flex;
    justify-content: center;
    margin: ${space(3)} 0;
    position: relative;
    width: 100%;
    height: ${rems(200)};

    img {
      object-fit: contain;
      height: 100%;
      width: auto;
    }

    .multi {
      display: none;
      ${media.min('tablet')`
      display: block;
    `}
    }

    .single {
      ${media.min('tablet')`
      display: none;
    `}
    }

    ${media.min('tablet')`
      margin: ${space(6)} 0;
    `}
  }

  p {
    margin-bottom: ${space(3)};
  }

  .empty-actions {
    display: grid;
    align-items: center;
    gap: ${space(2)};
    flex-direction: column;

    ${media.min('tablet')`
      justify-content: center;
      grid-template-columns: auto auto;
    `}
  }
`;

const Header = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: ${space(2)};

  .fishbowl-list__title {
    ${TEXT_LG}
    font-weight: 300;
  }

  .divider {
    border-bottom: 1px solid ${COLOR_NEUTRO_500};
    margin-bottom: ${space(1)};
    width: 100%;
    display: block;
  }

  div {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: ${space(2)};
  }

  .schedule-fishbowl {
    ${media.max('tablet')`
    padding: ${space(1.5)};
    `}

    span {
      ${media.max('tablet')`
      display: none;
   `}
    }
  }

  svg {
    display: inline-block;
    ${media.max('tablet')`
      margin-left: 0;
      width: auto;
      `}
  }
`;

const CardStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  padding: ${space(2)} ${space(2)};
  background-color: ${COLOR_NEUTRO_100};
  border: 1px solid ${COLOR_NEUTRO_500};
  border-radius: ${rems(8)};
  box-shadow: var(--shadow-elevation-medium);
  transition: all 0.2s ease-in-out;
  overflow: hidden;

  ${media.min('desktopLarge')`
    grid-template-columns: 3fr 4fr;
  `}

  .card__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .card__time span {
      color: ${COLOR_NEUTRO_600};
    }
  }

  .card__actions {
    display: flex;
    column-gap: ${space(3)};
    align-self: flex-end;
    justify-content: end;
    align-items: baseline;
  }

  &::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 4px;
    background-color: ${COLOR_NEUTRO_500};
    left: 0;
    top: 0;
    transition: all 0.2s ease-in-out;
  }

  &:hover {
    transform: translateY(-2px);
    cursor: pointer;
  }

  &.selected-card {
    border: 1px solid ${COLOR_GREEN_500};

    &::after {
      background-color: ${COLOR_GREEN_500};
      width: 6px;
    }
  }
`;

const CardTitle = styled.div`
  ${TEXT_MD};
  width: 100%;
  text-align: left;
  color: ${COLOR_NEUTRO_800};
  overflow: ellipsis;

  h4 {
    font-weight: 500;
  }

  ${media.min('desktopLarge')`
    grid-column: 1 / 3;
  `}
`;

const EditFormWrapper = styled.div`
  display: none;
  background-color: ${COLOR_NEUTRO_100};
  padding: ${space(2)} ${space(6)};
  border-radius: ${rems(4)};

  h2 {
    color: ${COLOR_NEUTRO_700};
  }

  ${media.min('desktopLarge')`
    display: block;
  `}
`;

export {
  FishbowlListWrapper,
  Header,
  CardStyled,
  FishbowlScrollList,
  CardTitle,
  EmptyFishbowlList,
  FishbowlListContent,
  EditFormWrapper
};
