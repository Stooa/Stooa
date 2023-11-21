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
  COLOR_NEUTRO_500,
  COLOR_NEUTRO_700,
  COLOR_NEUTRO_800
} from '@/ui/settings';
import { media, rems, space } from '@/ui/helpers';
import { BODY_LG, BODY_MD } from '@/ui/Texts';
import { scrolllbarStyle } from '@/ui/Scrollbar';

const FishbowlListWrapper = styled.div`
  height: 100%;
  padding-top: ${space(5)};
  padding-bottom: ${space(3)};
  width: 100%;
  max-width: ${BREAKPOINTS.desktopLarge}px;
`;

const FishbowlListContent = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  width: 100%;

  &.not-empty {
    height: 900px;
  }

  ${media.min('desktop')`
    &.not-empty {
      grid-template-columns: 1fr 1fr;
    }
    column-gap: ${space()};
  `}
`;

const FishbowlScrollList = styled.div`
  display: grid;
  position: relative;
  grid-auto-rows: minmax(min-content, max-content);
  row-gap: ${space(2)};
  padding-bottom: ${space(1)};
  align-items: start;
  padding-top: 4px;
  max-height: 100%;

  overflow-y: scroll;

  ${scrolllbarStyle}

  ${media.max('desktop')`
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
    overflow-y: scroll;

  &::-webkit-scrollbar {
      display: none; /* for Chrome, Safari, and Opera */
  }`}

  .fishbowl-list__empty-illustration {
    margin: ${space(2)} 0;
    position: relative;
    width: 100%;
    height: ${rems(200)};

    ${media.min('tablet')`
    margin: ${space(6)} 0;`}
  }
`;

const StyledEmptyFishbowlList = styled.div`
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
    margin-bottom: ${space(4)};
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

  h2 {
    margin-bottom: ${space(1)};
  }
`;

const StyledListHeader = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: ${space(2)};

  .fishbowl-list__header-link {
    ${BODY_LG}
  }

  .divider {
    border-bottom: 1px solid ${COLOR_NEUTRO_500};
    margin-bottom: ${space(1)};
    width: 100%;
    display: block;
  }

  .header__wrapper {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: ${space(2)};
    width: 100%;

    & .fishbowl-list__header {
      display: flex;
      flex-wrap: wrap;
      gap: ${space()} ${space(2)};
      width: 50%;
      & .fishbowl-list__header-link {
        flex: 0;
        width: max-content;
        white-space: nowrap;
      }
    }
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

const CardTitle = styled.div`
  ${BODY_MD};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: left;
  color: ${COLOR_NEUTRO_800};
  overflow: ellipsis;
  display: flex;

  h4 {
    font-weight: 500;
  }

  svg {
    margin-right: ${space(0.5)};
    width: ${rems(19)};
    height: ${rems(19)};
  }
`;

const CardStyled = styled.div`
  position: relative;
  display: grid;
  align-items: flex-end;
  column-gap: ${space(2)};

  padding: ${space(2)} ${space(2)};

  background-color: ${COLOR_NEUTRO_100};
  border: 1px solid ${COLOR_NEUTRO_500};
  border-radius: ${rems(8)};
  box-shadow: var(--shadow-elevation-medium);
  transition: all 0.2s ease-in-out;
  overflow: hidden;

  & .card__info {
    text-align: left;
  }

  &.finished {
    grid-template-columns: 6fr 1fr;

    ${media.min('tablet')`
      grid-template-columns: 1fr;
    `}

    &.no-feedback {
      grid-template-columns: 1fr;
    }

    & .card__info {
      gap: ${space()} ${space(4)};
      display: flex;
      flex-wrap: wrap;
      grid-column: 1 / 2;

      ${media.max('tablet')`
         flex-direction: column;
        `}

      & > .card__first-row {
        display: flex;
        gap: ${space(2)};
        flex: 1;
        align-items: flex-start;
        justify-content: space-between;

        ${media.max('tablet')`
          width: 100%;
        `}
      }

      & .card__second-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: ${space(4)};
        width: 100%;

        flex: 2;
      }

      & h4 {
        font-weight: 300;
      }

      .card__participants {
        display: flex;
        align-items: center;

        & svg {
          margin-right: ${space(0.5)};
        }
      }
    }

    & .card__chart {
      width: 90px;
      & h4 {
        margin-bottom: ${space(0.5)};
      }
    }

    & .card__chart-wrapper {
      width: 50px;
      height: 50px;
    }

    & .card__mobile-chart {
      grid-column: 2;
      grid-row: 2;

      &.card__chart-wrapper {
        width: 36px;
        height: 36px;
      }
    }
  }

  .card__actions {
    display: flex;
    min-height: ${rems(38)};
    column-gap: ${space(3)};
    align-self: flex-end;
    justify-content: flex-end;
    align-items: center;

    & > a {
      align-items: baseline;
    }
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

const EditFormWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  border-radius: ${rems(4)};

  overflow-y: scroll;
  ${media.min('desktop')`
    overflow-y: hidden;
  `}

  .form-header {
    position: relative;
  }

  h2 {
    color: ${COLOR_NEUTRO_700};
  }

  .form-wrapper {
    background-color: ${COLOR_NEUTRO_100};
    padding: ${space(6)} ${space(3)} ${space(3)};

    ${media.min('desktop')`
      padding: ${space(2)} ${space(6)} ${space(6)};
    `}
  }

  ${media.max('desktop')`
    background-color: rgba(0, 0, 0, 0.5);
  `}

  ${media.min('desktop')`
    height: 100%;
    position: relative;
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */

    &::-webkit-scrollbar {
        display: none; /* for Chrome, Safari, and Opera */
    }
  `}
`;

const StyledDetailPlaceholder = styled.div`
  &.not-selected {
    ${media.max('desktop')`
    display: none;
    `}
  }
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${rems(4)};
  min-height: 500px;
  background-color: ${COLOR_NEUTRO_100};
  padding: ${space(3)};

  ${media.max('desktop')`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;`};

  p {
    margin-bottom: ${space(3)};
  }

  a.enter-fishbowl {
    margin-bottom: ${space(4)};
  }

  button.back {
    display: none;
    ${media.max('desktop')`
      display: block;
    `}
  }
`;

const MobileBackButton = styled.button`
  position: absolute;
  left: ${space()};

  &.top {
    top: ${rems(20)};
  }
  &.bottom {
    bottom: ${rems(6)};
  }

  ${media.min('desktop')`
      display: none;
  `}
`;

const StyledFishbowlDashboardData = styled.div`
  padding: ${space(4)};
  background-color: ${COLOR_NEUTRO_100};
  text-align: left;
  overflow-y: scroll;
  height: 100%;

  ${scrolllbarStyle};

  ${media.max('desktop')`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;`};

  & .header-wrapper {
    position: relative;
  }

  & h2 {
    margin-bottom: ${space(2)};
    text-align: center;
  }

  & h3 {
    color: ${COLOR_NEUTRO_800};
    margin-bottom: ${space(0.5)};
    font-weight: 500;
  }

  & h4 {
    font-weight: 500;
  }

  & .description {
    margin-bottom: ${space(2)};
  }

  & .data {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${space()};

    margin-bottom: ${space(2)};
  }

  & .data__title {
    display: flex;
    align-items: flex-end;
    gap: ${space(0.5)};
    margin-left: -5px;

    margin-bottom: ${space(0.5)};

    & h4 {
      font-weight: 300;
    }

    & svg {
      width: 32px !important;
      height: 32px !important;
    }
  }

  & .data__group {
    flex: 0 120px;
    & p + p {
      margin-top: ${space(0.5)};
    }

    &.participants p svg {
      width: 16px;
      height: 16px;
      margin-left: 4px;
      transform: translateY(3px);
    }
  }

  & .feedback {
    & h3 {
      color: ${COLOR_NEUTRO_700};
      font-weight: 500;
      margin-bottom: ${space(2)};
    }
  }
`;

export {
  FishbowlListWrapper,
  StyledListHeader,
  CardStyled,
  FishbowlScrollList,
  CardTitle,
  StyledEmptyFishbowlList,
  FishbowlListContent,
  EditFormWrapper,
  StyledDetailPlaceholder,
  MobileBackButton,
  StyledFishbowlDashboardData
};
