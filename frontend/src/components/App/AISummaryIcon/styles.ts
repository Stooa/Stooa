/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { COLOR_NEUTRO_100, COLOR_NEUTRO_700 } from '@/ui/settings';
import styled from 'styled-components';

const StyledAISummaryIconWrapper = styled.div`
  position: relative;
  height: 18px;

  & button {
    display: inline-block;
    cursor: pointer;
  }
`;

const StyledBorderCard = styled.div<{ shadow?: boolean; centered?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1em;

  color: ${COLOR_NEUTRO_700};
  padding: 1em;

  background-color: ${COLOR_NEUTRO_100};
  border: ${COLOR_NEUTRO_700} 1px solid;
  border-radius: 8px;

  text-align: ${({ centered }) => (centered ? 'center' : 'left')};
  box-shadow: ${({ shadow }) => (shadow ? '0px 2px 2px 0px rgba(0, 0, 0, 0.1)' : 'none')};
`;

const StyledCardTitleWithIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  margin-bottom: 0.5em;

  & > svg {
    width: 1.5em;
    height: 1.5em;
  }
`;

const StyledThankyouAICard = styled(StyledBorderCard)`
  max-width: 360px;
  gap: 1.25em;
  align-items: center;
  margin: 0 auto;
`;

const StyledAITooltip = styled(StyledBorderCard)`
  position: absolute;
  top: calc(100% + 0.5em);
  left: 50%;
  transform: translateX(-50%);
  width: 330px;
  max-width: 330px;
`;

export {
  StyledAISummaryIconWrapper,
  StyledAITooltip,
  StyledBorderCard,
  StyledCardTitleWithIcon,
  StyledThankyouAICard
};
