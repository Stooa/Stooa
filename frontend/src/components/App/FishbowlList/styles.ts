/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';
import { BREAKPOINTS, COLOR_NEUTRO_100, COLOR_NEUTRO_500, COLOR_NEUTRO_800 } from '@/ui/settings';
import { rems, space } from '@/ui/helpers';
import { APP_MD, TEXT_LG, TEXT_MD } from '@/ui/Texts';

const FishbowlListWrapper = styled.div`
  height: 100%;
  padding: ${space(5)} 0;
  width: ${BREAKPOINTS.desktop}px;
`;

const ScrollWrapper = styled.div`
  display: grid;
  row-gap: ${space(2)};

  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: ${space(2)};

  .fishbowlist__title {
    ${TEXT_LG}
    margin-bottom: ${space(1)};
    font-weight: 300;
  }

  .divider {
    border-bottom: 1px solid ${COLOR_NEUTRO_500};
    margin-bottom: ${space(1)};
    width: 100%;
    display: block;
  }
`;

const CardStyled = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${COLOR_NEUTRO_100};
  border-radius: ${rems(8)};
  padding: ${space(1)} ${space(2)};

  box-shadow: var(--shadow-elevation-medium);

  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 4px;
    background-color: ${COLOR_NEUTRO_500};
    left: 0;
    top: 0;
  }
  .card__title {
    ${TEXT_MD};
    font-weight: 500;
    color: ${COLOR_NEUTRO_800};
  }
`;

export { FishbowlListWrapper, Header, CardStyled, ScrollWrapper };
