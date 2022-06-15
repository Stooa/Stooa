/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useRef, useState } from 'react';
import { StyledButtonReaction, StyledWrapper } from './styles';
import ReactionsSender from '../ReactionsSender';
import Laugh from '@/ui/svg/emojis/laugh.svg';
import Plus from '@/ui/svg/emojis/plus.svg';

interface Props {
  disabled?: boolean;
}

const ReactionsButton = ({ disabled }: Props) => {
  const [showReactions, setShowReactions] = useState(false);
  const [animation, setAnimation] = useState<'open' | 'close'>('open');
  const wrapperRef = useRef(null);
  const timeOutRef = useRef(null);

  const hide = async ms => {
    if (animation === 'open') {
      setAnimation('close');
      timeOutRef.current = setTimeout(() => setShowReactions(false), ms);
    }
  };

  const show = () => {
    setAnimation('open');
    setShowReactions(true);
  };

  const handleClick = () => {
    if (showReactions && animation === 'open') {
      hide(600);
    } else {
      show();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showReactions && wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        hide(1200);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactions]);

  useEffect(() => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
  }, [animation]);

  return (
    <StyledWrapper ref={wrapperRef}>
      {showReactions && <ReactionsSender className={animation} onMouseLeave={() => hide(1200)} />}
      <StyledButtonReaction disabled={disabled} onClick={handleClick}>
        <div className="plus">
          <Plus />
        </div>
        <Laugh />
        <div className="label medium">Reactions</div>
      </StyledButtonReaction>
    </StyledWrapper>
  );
};

export default ReactionsButton;
