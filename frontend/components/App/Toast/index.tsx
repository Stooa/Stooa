/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';

import CrossIcon from 'ui/svg/cross.svg';
import { Container, Cross } from 'components/App/Toast/styles';

interface IProps {
  message: string;
  onDismiss: () => void;
}

const Toast: React.FC<IProps> = ({ message, onDismiss }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 500);
  }, []);

  return (
    <Container show={show}>
      <span className="app-md">{message}</span>
      <Cross onClick={onDismiss}>
        <CrossIcon />
      </Cross>
    </Container>
  );
};

export default Toast;
