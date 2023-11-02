/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { space } from '@/ui/helpers';
import Modal from '@/ui/Modal';

import styled from 'styled-components';

const StyledConfirmationModal = styled(Modal)`
  & .modal-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: ${space(2)};
    margin: 0;
  }
`;

export { StyledConfirmationModal };
