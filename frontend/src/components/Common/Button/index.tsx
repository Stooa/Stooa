/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { ComponentProps, forwardRef } from 'react';
import { StyledComponent } from 'styled-components';

import {
  LinkStyledButton,
  PrimaryButton,
  SecondaryButton,
  SIZES,
  SubtleLinkStyledButton,
  TextButton
} from '@/ui/Button';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'text' | 'link' | 'subtleLink';
  size?: 'small' | 'medium' | 'large';
  as?: 'button' | 'a';
  full?: boolean;
};

const Buttons = {
  primary: PrimaryButton,
  secondary: SecondaryButton,
  text: TextButton,
  link: LinkStyledButton,
  subtleLink: SubtleLinkStyledButton
};

/**
 * Main button component
 * @param as button or a
 * @param variant primary, secondary, text, link, subtleLink
 * @param size small, medium or large
 * @returns
 */
const Button: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { variant = 'primary', size = 'medium', children, as = 'button', full, ...props },
  ref
) => {
  const styles = SIZES[size];
  const Component: StyledComponent<'button', never, Record<string, unknown>> = Buttons[variant];

  return (
    <Component ref={ref} as={as} style={styles} full={full} {...props}>
      {children}
    </Component>
  );
};

export default forwardRef(Button);
