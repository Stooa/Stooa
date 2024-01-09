/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BODY_SM } from '@/ui/Texts';
import { BORDER_RADIUS, COLOR_NEUTRO_300, COLOR_NEUTRO_400, COLOR_NEUTRO_500 } from '@/ui/settings';

import styled from 'styled-components';

export const StandardWYSIWYGStyles = styled.div`
  & ul {
    list-style: disc;
    padding-left: 1rem;
  }

  & ol {
    list-style: decimal;
    padding-left: 1rem;
  }

  & a {
    font-size: inherit;
    text-decoration: underline;
  }
`;

const StyledEditorWrapper = styled(StandardWYSIWYGStyles)`
  ${BODY_SM};
  display: flex;
  width: 100%;

  flex-direction: column;
  row-gap: 0.25rem;

  background-color: ${COLOR_NEUTRO_300};

  border-radius: ${BORDER_RADIUS};
  border: 1px ${COLOR_NEUTRO_400} solid;

  .tiptap {
    min-height: 100px;
    padding: 0.5rem;
    border-radius: ${BORDER_RADIUS};

    &:focus-visible {
      outline: ${COLOR_NEUTRO_500} 2px;
      outline-style: solid;
    }
  }
`;

const StyledToolbar = styled.div`
  display: flex;
  padding: 0.25rem;
  gap: 0.5rem;

  border-bottom: 1px ${COLOR_NEUTRO_400} solid;
`;

const ToolbarButton = styled.button`
  font-size: 14px;
  min-width: 1.4rem;
  min-height: 1.4rem;
  padding: 0.25rem;

  border-radius: ${BORDER_RADIUS};
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  & svg {
    width: 1.2rem;
    height: 1.2rem;
  }

  &:hover {
    background-color: ${COLOR_NEUTRO_400};
  }

  &.is-active {
    background-color: ${COLOR_NEUTRO_400};
  }

  &:disabled {
    background-color: ${COLOR_NEUTRO_400};
    color: ${COLOR_NEUTRO_500};
  }

  &:focus-visible {
    outline: ${COLOR_NEUTRO_500} 2px;
    outline-style: solid;
  }
`;

export { StyledEditorWrapper, ToolbarButton, StyledToolbar };
