/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';
import Laugh from '@/ui/svg/emojis/laugh.svg';
import { StyledWrapper, StyledButtonReaction } from './styles';
import { ReactionsSender } from '../ReactionsSender';

interface Props {
  disabled?: boolean;
}

export const ButtonReactions = ({ disabled }: Props) => {
  const [showReactions, setShowReactions] = useState(false);
  const [animation, setAnimation] = useState<'open' | 'close'>('open');

  const hide = async ms => {
    setAnimation('close');

    await new Promise(r => setTimeout(r, ms));

    setShowReactions(false);
  };

  const show = () => {
    setAnimation('open');
    setShowReactions(true);
  };

  return (
    <StyledWrapper>
      {/* {showReactions &&  */}
      <ReactionsSender className={animation} onMouseLeave={() => hide(200)} />
      {/* } */}
      <StyledButtonReaction disabled={disabled} onClick={() => show()}>
        <Laugh />
        <span className="medium body-sm">Reactions</span>
      </StyledButtonReaction>
    </StyledWrapper>
  );
};
