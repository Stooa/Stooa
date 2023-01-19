/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StyledResponsiveRow, Wrapper } from '@/landing/ui/styles';

interface Props {
  children: readonly [JSX.Element, JSX.Element];
  align?: 'end' | 'center' | 'start';
  className?: string;
  mediaComponent?: JSX.Element;
  reverse?: boolean;
  colored?: boolean;
  spacing?: 'small' | 'medium' | 'large';
}

const ResponsiveRow = ({
  children,
  align = 'center',
  reverse,
  colored,
  className,
  spacing
}: Props): JSX.Element => {
  return (
    <Wrapper colored={colored} className={className} spacing={spacing}>
      <StyledResponsiveRow reverse={reverse} className="animate" align={align}>
        <div className="item animate-item ">{children[0]}</div>
        <div className="item centered animate-item last-item">{children[1]}</div>
      </StyledResponsiveRow>
    </Wrapper>
  );
};

export default ResponsiveRow;
