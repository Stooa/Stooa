/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useDebounce from '@/hooks/useDebouce';
import React, { useEffect, useState } from 'react';
import EmojiReaction from '../EmojiReaction';
import { EmojiSpawner, ReactionsWrapper } from './styles';

import applause from '@/ui/svg/emojis/applause.svg';
import like from '@/ui/svg/emojis/like.svg';
import love from '@/ui/svg/emojis/love.svg';
import laugh from '@/ui/svg/emojis/laugh.svg';
import insightful from '@/ui/svg/emojis/insightful.svg';
import wave from '@/ui/svg/emojis/wave.svg';
import curious from '@/ui/svg/emojis/curious.svg';
import { Node } from 'typescript';

interface Props {
  onMouseEnter?: (mouseEvent: React.MouseEvent) => void;
  onMouseLeave?: (mouseEvent: React.MouseEvent) => void;
  className?: string;
}

const EMOJIS = {
  like: <svg></svg>,
  love: <svg></svg>,
  applause: <svg></svg>,
  laugh: <svg></svg>,
  wave: <svg></svg>,
  insightful: <svg></svg>,
  curious: <svg></svg>
};

export const ReactionsSender = ({ onMouseLeave, className }: Props) => {
  const [emojisToSend, setEmojisToSend] = useState('');
  const debouncedEmojis = useDebounce<string>(emojisToSend, 600);
  const emojiSpawnerRef = React.useRef<HTMLDivElement>(null);
  const [clientEmojisShown, setClientEmojisShown] = useState([]);

  const spawnEmoji = (emojiToSpawn: string, xCoordenate: number): void => {
    const EmojiToAppend = EMOJIS[emojiToSpawn];
    const emojiWrapper = document.createElement('div');
    emojiWrapper.className = 'emoji';
    emojiWrapper.style.left = `${xCoordenate}px`;
    emojiWrapper.style.position = 'absolute';
    emojiWrapper.appendChild(EmojiToAppend);

    setClientEmojisShown(emojis => [...emojis, emojiWrapper]);

    setTimeout(() => {
      setClientEmojisShown(emojis => (emojis.length > 1 ? emojis.slice(1) : []));
    }, 1000);
  };

  const handleClick = (mouseEvent: React.MouseEvent) => {
    const target = mouseEvent.currentTarget as HTMLDivElement;
    console.log([mouseEvent.clientX, mouseEvent.clientY]);

    if (target.id) {
      //client side
      target;
      spawnEmoji(target.id, mouseEvent.clientX);

      //server side
      setEmojisToSend(emojisToSend => emojisToSend + target.innerText);
    }
  };

  useEffect(() => {
    if (debouncedEmojis) {
      // Send here emojis to sendmessage
      console.log('sending', debouncedEmojis.slice(0, 10));

      setEmojisToSend('');
    }
  }, [debouncedEmojis]);

  return (
    <ReactionsWrapper className={className} onMouseLeave={onMouseLeave}>
      <EmojiSpawner ref={emojiSpawnerRef} id="emoji-spawner">
        {clientEmojisShown}
      </EmojiSpawner>

      <EmojiReaction emoji="like" onClick={handleClick} />
      <EmojiReaction emoji="love" onClick={handleClick} />
      <EmojiReaction emoji="applause" onClick={handleClick} />
      <EmojiReaction emoji="laugh" onClick={handleClick} />
      <EmojiReaction emoji="wave" onClick={handleClick} />
      <EmojiReaction emoji="insightful" onClick={handleClick} />
      <EmojiReaction emoji="curious" onClick={handleClick} />
    </ReactionsWrapper>
  );
};
