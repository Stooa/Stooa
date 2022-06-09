/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useRef, useState } from 'react';
import { StyledButtonReaction } from './styles';
import ReactionsSender from '../ReactionsSender';
import Laugh from '@/ui/svg/emojis/laugh.svg';
import Cross from '@/ui/svg/cross.svg';

interface Props {
  disabled?: boolean;
}

export const ButtonReactions = ({ disabled }: Props) => {
  const [showReactions, setShowReactions] = useState(false);
  const [animation, setAnimation] = useState<'open' | 'close'>('open');
  const wrapperRef = useRef(null);

  const hide = async ms => {
    setAnimation('close');
    setTimeout(() => setShowReactions(false), ms);
  };

  const show = () => {
    setAnimation('open');
    setShowReactions(true);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showReactions && wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowReactions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactions]);

  return (
    <div ref={wrapperRef}>
      {showReactions && <ReactionsSender className={animation} onMouseLeave={() => hide(300)} />}
      <StyledButtonReaction disabled={disabled} onClick={() => show()}>
        <div className="cross">
          <Cross />
        </div>
        <Laugh />
        <span className="medium body-sm">Reactions</span>
      </StyledButtonReaction>
    </div>
  );
};
