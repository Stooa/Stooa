/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import lottie from 'lottie-web';
import { useEffect } from 'react';

import { IconWrapper } from '@/components/Common/LoadingIcon/styles';
import LoaderJson from '@/ui/animations/loader/loader.json';

const LoadingIcon = () => {
  useEffect(() => {
    lottie.loadAnimation({
      container: document.getElementById('loading-svg'),
      animationData: LoaderJson,
      renderer: 'svg',
      loop: true,
      autoplay: true
    });
  }, []);

  return <IconWrapper id="loading-svg"></IconWrapper>;
};

export default LoadingIcon;
