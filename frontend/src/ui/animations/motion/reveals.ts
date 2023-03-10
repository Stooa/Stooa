/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Variants } from 'framer-motion';

const basicRevealWithDelay: Variants = {
  initial: {
    opacity: 0.8,
    y: '-6px'
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeInOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      delay: 0.4
    }
  }
};

const bottomMobileReveal: Variants = {
  initial: {
    y: '100%',
    opacity: 1
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  },
  exit: {
    x: '100%',
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeInOut'
    }
  }
};

export { basicRevealWithDelay, bottomMobileReveal };
