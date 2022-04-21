/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { PrimaryButton, SecondaryButton, SIZES, TextButton } from '@/ui/Button';

interface Props extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'small' | 'medium' | 'large';
  as?: 'button' | 'a';
  full?: boolean;
}
/**
 * Main button component
 * @param variant primary, secondary or text
 * @param size small, medium or large
 * @param as button or a
 * @returns
 */
const Button: React.FC<Props> = ({
  variant = 'primary',
  size = 'medium',
  children,
  as = 'button',
  full,
  ...props
}) => {
  const styles = SIZES[size];

  let Component;
  if (variant === 'primary') {
    Component = PrimaryButton;
  } else if (variant === 'secondary') {
    Component = SecondaryButton;
  } else if (variant === 'text') {
    Component = TextButton;
  }

  return (
    <Component as={as} style={styles} full={full} {...props}>
      {children}
    </Component>
  );
};

export default Button;
