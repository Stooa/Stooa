/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StyledTitleWithDivider } from './styles';

interface Props {
  children: string | string[] | JSX.Element;
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const TitleWithDivider = ({ children, headingLevel, ...props }: Props) => {
  return (
    <StyledTitleWithDivider as={headingLevel} {...props}>
      {children}
      <span className="divider" />
    </StyledTitleWithDivider>
  );
};

export default TitleWithDivider;
