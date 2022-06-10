/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Reaction } from '@/types/reactions';

const Reactions = () => {
  const createReaction = (reactionName: string, xPosition: number | string = 0): Reaction => {
    const randomYPosition = Math.floor(Math.random() * 20);
    const fast = Math.random() >= 0.5;
    return {
      id: Math.floor(Math.random() * 100).toString(),
      reaction: reactionName,
      xCoordinate: xPosition,
      yCoordinate: randomYPosition,
      animation: fast ? 'emoji-fast' : 'emoji-standard'
    };
  };

  return { createReaction };
};

export default Reactions();
