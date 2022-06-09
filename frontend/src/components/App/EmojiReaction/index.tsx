/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';
import { StyledEmojiReaction } from './styles';

import Applause from '@/ui/svg/emojis/applause.svg';
import Like from '@/ui/svg/emojis/like.svg';
import Love from '@/ui/svg/emojis/love.svg';
import Laugh from '@/ui/svg/emojis/laugh.svg';
import Insightful from '@/ui/svg/emojis/insightful.svg';
import Wave from '@/ui/svg/emojis/wave.svg';
import Curious from '@/ui/svg/emojis/curious.svg';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  emoji: 'like' | 'love' | 'applause' | 'laugh' | 'wave' | 'insightful' | 'curious';
  onClick: (mouseEvent: React.MouseEvent) => void;
  disabled?: boolean;
}

export const EMOJIS = {
  like: { component: <Like style={{}} />, id: 1 },
  love: { component: <Love style={{}} />, id: 2 },
  applause: { component: <Applause style={{}} />, id: 3 },
  laugh: { component: <Laugh style={{}} />, id: 4 },
  wave: { component: <Wave />, id: 5 },
  insightful: { component: <Insightful />, id: 6 },
  curious: { component: <Curious />, id: 7 }
};

const EmojiReaction = ({ onClick, emoji, disabled, ...props }: Props) => {
  const [size, setSize] = useState(1);
  const [clicked, setClicked] = useState(0);

  const handleOnClick = mouseEvent => {
    if (!disabled) {
      setClicked(clicked => clicked + 1);
      setSize(size => (size < 1.5 ? size + 0.05 : size));
      onClick(mouseEvent);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setClicked(0);
      setSize(1);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [clicked]);

  return (
    <StyledEmojiReaction
      className={disabled ? 'disabled' : ''}
      id={emoji}
      onClick={handleOnClick}
      style={{ '--emojiScale': size } as React.CSSProperties}
      {...props}
    >
      {EMOJIS[emoji].component}
    </StyledEmojiReaction>
  );
};

export default EmojiReaction;
