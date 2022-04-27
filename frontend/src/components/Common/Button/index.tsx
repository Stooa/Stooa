/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';

import {
  LinkStyledButton,
  PrimaryButton,
  SecondaryButton,
  SIZES,
  SubtleLinkStyledButton,
  TextButton
} from '@/ui/Button';

interface Props extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'text' | 'link' | 'subtleLink';
  size?: 'small' | 'medium' | 'large';
  as?: 'button' | 'a';
  full?: boolean;
}
/**
 * Main button component
 * @param as button or a
 * @param variant primary, secondary, text, link, subtleLink
 * @param size small, medium or large
 * @returns
 */
const Button: React.FC<Props> = React.forwardRef(
  ({ variant = 'primary', size = 'medium', children, as = 'button', full, ...props }, ref) => {
    const styles = SIZES[size];

    let Component;
    if (variant === 'primary') {
      Component = PrimaryButton;
    } else if (variant === 'secondary') {
      Component = SecondaryButton;
    } else if (variant === 'text') {
      Component = TextButton;
    } else if (variant === 'link') {
      Component = LinkStyledButton;
    } else if (variant === 'subtleLink') {
      Component = SubtleLinkStyledButton;
    }

    return (
      <Component ref={ref} as={as} style={styles} full={full} {...props}>
        {children}
      </Component>
    );
  }
);

export default Button;
