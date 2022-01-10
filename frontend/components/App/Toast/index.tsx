/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useState } from 'react';

import CrossIcon from '@/ui/svg/cross.svg';
import { Container, Cross } from '@/components/App/Toast/styles';

interface Props {
  message: string;
  onDismiss: void;
}

const Toast: React.FC<Props> = ({ message, onDismiss }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 500);
  }, []);

  return (
    <Container show={show}>
      <span className="app-md toastcomponent">{message}</span>
      <Cross onClick={onDismiss}>
        <CrossIcon />
      </Cross>
    </Container>
  );
};

export default Toast;
