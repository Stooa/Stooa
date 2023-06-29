/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Loader from '@/ui/svg/spin-loader.svg';
import { StyledSpinningLoader } from './styles';

const SpinningLoader = () => {
  return (
    <StyledSpinningLoader>
      <Loader className="loader" />
    </StyledSpinningLoader>
  );
};

export default SpinningLoader;
