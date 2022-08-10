/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StyledDots } from './style';

const LoadingDots = () => {
  return (
    <StyledDots>
      <span className="dot1">.</span>
      <span className="dot2">.</span>
      <span className="dot3">.</span>
    </StyledDots>
  );
};

export default LoadingDots;
