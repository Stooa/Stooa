/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BORDER_RADIUS, COLOR_NEUTRO_400 } from '@/ui/settings';
import styled from 'styled-components';

const StyledWorldCafeForm = styled.form`
  width: 100%;
  max-width: 600px;

  & > div > * + * {
    margin-top: 1rem;
  }
`;

const StyledAddButton = styled.button`
  display: block;
  padding: 0.5rem 1rem;
  border: 1px solid ${COLOR_NEUTRO_400};
  border-radius: ${BORDER_RADIUS};
`;

const StyledScrollWrapper = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: hidden;
  width: 100%;

  & > #step-general,
  & > #step-questions {
    width: 100%;
    flex-shrink: 0;
  }
`;

export { StyledWorldCafeForm, StyledAddButton, StyledScrollWrapper };
