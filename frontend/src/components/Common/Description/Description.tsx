/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StyledDescription } from './style';

interface Props {
  children: React.ReactNode;
  className?: string;
  center?: boolean;
}

const Description = ({ children, className = '', center }: Props) => {
  return (
    <StyledDescription center={center} className={className}>
      {children}
    </StyledDescription>
  );
};

export default Description;
