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

const buttonVariant = {
  button: Button,
  small: ButtonSmall,
  default: Button,
  link: 'a'
};

const GAButton = (props: any, ref: any) => {
  const { event, children, variant = 'default', ...other } = props;
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
