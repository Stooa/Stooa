/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { forwardRef } from 'react';

import { pushEventDataLayer } from 'lib/analytics';
import Button, {
  ButtonLink,
  ButtonSmall,
  ButtonStyledLink,
  ButtonStyledLinkSmall,
  StyledLink
} from 'ui/Button';

interface Props {
  event: {
    category: string;
    action: string;
    label: string;
  };
  children: React.ReactNode;
  variant?: 'button' | 'small' | 'link';
  asElement?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
}

const buttonVariant = {
  button: Button,
  small: ButtonSmall,
  link: ButtonLink
};

const linkVariant = {
  button: ButtonStyledLink,
  small: ButtonStyledLinkSmall,
  link: StyledLink
};

const GAButton = ({ event, children, variant = 'button', asElement, ...props }: Props, ref) => {
  let ButtonComponent;
  let LinkComponent;

  if (asElement === 'a') {
    LinkComponent = linkVariant[variant];
  } else {
    ButtonComponent = buttonVariant[variant];
  }

  const onClick = () => {
    pushEventDataLayer(event);
  };

  return asElement === 'a' ? (
    <LinkComponent ref={ref} {...props} onClick={onClick}>
      {children}
    </LinkComponent>
  ) : (
    <ButtonComponent ref={ref} {...props} onClick={onClick}>
      {children}
    </ButtonComponent>
  );
};

export default forwardRef(GAButton);
