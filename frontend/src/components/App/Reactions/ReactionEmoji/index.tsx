/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useWindowSize } from '@/hooks/useWIndowSize';
import { useEffect, useState } from 'react';
import { REACTION_EMOJIS } from '../ReactionsEmojis';
import { StyledEmojiReaction } from './styles';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  emoji: 'like' | 'love' | 'applause' | 'laugh' | 'wave' | 'insightful' | 'curious';
  onClick: (mouseEvent: React.MouseEvent) => void;
  disabled?: boolean;
}

const ReactionEmoji = ({ onClick, emoji, disabled, ...props }: Props) => {
  const { width } = useWindowSize();
  const emojiSize = width && width > 380 ? 1 : 0.75;

  const [size, setSize] = useState(emojiSize);
  const [clicked, setClicked] = useState(0);

  const handleOnClick = mouseEvent => {
    if (!disabled) {
      setClicked(clicked => clicked + 1);
      const scaleInterval = clicked === 0 ? 0.12 : 0.035;
      setSize(size => (size < 1.435 ? size + scaleInterval : size));
      onClick(mouseEvent);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setClicked(0);
      setSize(emojiSize);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [clicked]);

  useEffect(() => {
    setSize(emojiSize);
  }, [width]);

  if (width) {
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
  } else {
    return <div>ono</div>;
  }
};

export default ReactionEmoji;
