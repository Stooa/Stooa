/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { forwardRef } from 'react';
import { StyledTitleWithDivider } from './styles';

interface Props {
  children: string | string[] | JSX.Element;
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  id?: string;
}

const TitleWithDivider = forwardRef<HTMLDivElement, Props>(
  ({ children, headingLevel, id }, ref) => {
    return (
      <StyledTitleWithDivider ref={ref} as={headingLevel} id={id}>
        {children}
        <span className="divider" />
      </StyledTitleWithDivider>
    );
  }
);

export default TitleWithDivider;
