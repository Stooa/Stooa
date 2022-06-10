/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';
import { REACTION_EMOJIS } from '../ReactionsEmojis';
import { StyledEmojiReaction } from './styles';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  emoji: 'like' | 'love' | 'applause' | 'laugh' | 'wave' | 'insightful' | 'curious';
  onClick: (mouseEvent: React.MouseEvent) => void;
  disabled?: boolean;
}

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
      {REACTION_EMOJIS[emoji]}
    </StyledEmojiReaction>
  );
};

export default EmojiReaction;
