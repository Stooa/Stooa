/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { forwardRef } from 'react';

import { pushEventDataLayer } from 'lib/analytics';
import Button, { ButtonSmall } from 'ui/Button';

interface Props {
  event: {
    category: string;
    action: string;
    label: string;
  },
  variant?: 'button'|'small'|'default'|'link';
}

const buttonVariant = {
  button: Button,
  small: ButtonSmall,
  default: Button,
  link: 'a'
};

const GAButton = ({ event, variant = 'default', children, ...other }, ref): Props => {
  const ButtonComponent = buttonVariant[variant];

  const onClick = () => {
    pushEventDataLayer(event);
  };

  return (
    <ButtonComponent ref={ref} {...other} onClick={onClick}>
      {children}
    </ButtonComponent>
  );
};

export default forwardRef(GAButton);
