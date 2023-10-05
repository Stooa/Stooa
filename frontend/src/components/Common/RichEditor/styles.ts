/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BORDER_RADIUS, COLOR_NEUTRO_200, COLOR_NEUTRO_300, COLOR_NEUTRO_500 } from '@/ui/settings';
import styled from 'styled-components';

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;

  & ul {
    list-style: circle;
    padding-left: 1rem;
  }
`;

const StyledToolbar = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ToolbarButton = styled.button`
  width: 2rem;
  height: 2rem;
  padding: 0.25rem;
  background-color: ${COLOR_NEUTRO_200};
  border: 1px ${COLOR_NEUTRO_500} solid;
  border-radius: ${BORDER_RADIUS};
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: ${COLOR_NEUTRO_300};
  }
`;

export { StyledEditorWrapper, ToolbarButton, StyledToolbar };
