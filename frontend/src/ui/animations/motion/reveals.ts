/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const basicReveal = {
  initial: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  },
  exit: {
    opacity: 0
  }
};

const bottomMobileReveal = {
  initial: {
    y: '100%',
    opacity: 0
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

export { basicReveal, bottomMobileReveal };
