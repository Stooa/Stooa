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
import EmojiReaction, { EMOJIS } from '../EmojiReaction';
import { EmojiSpawner, ReactionsWrapper } from './styles';

interface Props {
  onMouseEnter?: (mouseEvent: React.MouseEvent) => void;
  onMouseLeave?: (mouseEvent: React.MouseEvent) => void;
  className?: string;
}

export const ReactionsSender = ({ onMouseLeave, className }: Props) => {
  const [emojisToSend, setEmojisToSend] = useState<string[]>([]);
  const [clientEmojisShown, setClientEmojisShown] = useState<[string, number][]>([]);
  const [timesClicked, setTimesClicked] = useState(0);
  const [lastLocationClicked, setLastLocationClicked] = useState<number>();

  const debouncedEmojis = useDebounce<string[]>(emojisToSend, 600);
  const emojiSpawnerRef = React.useRef<HTMLDivElement>(null);

  const spawnEmoji = (emojiToSpawn: string, xCoordenate: number): void => {
    console.log('wtf');
    const randomNumber = Math.floor(Math.random() * 10);
    setClientEmojisShown(emojis => [...emojis, [emojiToSpawn, xCoordenate + randomNumber]]);
  };

  const spawnEmojisBatch = (emojis): void => {
    const emojisWithCoordenates = emojis.map((emoji, index) => [
      emoji,
      lastLocationClicked - 100 + index * 20
    ]);

    setClientEmojisShown(emojisWithCoordenates);
  };

  const handleClick = (mouseEvent: React.MouseEvent) => {
    console.log('Handle click', timesClicked);
    const target = mouseEvent.currentTarget as HTMLDivElement;
    const { x: xCoordinate } = target.getBoundingClientRect();
    const emojiCoordinate = xCoordinate + 20;

    if (target.id) {
      //client side
      if (timesClicked < 10) {
        console.log('no more than 10 clicks');
        setTimesClicked(timesClicked => timesClicked + 1);
        spawnEmoji(target.id, emojiCoordinate);
      }

      setLastLocationClicked(emojiCoordinate);

      //server side
      setEmojisToSend(emojisToSend => [...emojisToSend, target.id]);
    }
  };

  useEffect(() => {
    if (debouncedEmojis.length > 0) {
      // Send here emojis to sendmessage
      console.log('only debounced');

      console.log('sending', debouncedEmojis.slice(0, 10));
      if (timesClicked === 10) {
        spawnEmojisBatch(debouncedEmojis.slice(0, 10));
        setEmojisToSend([]);
        setTimesClicked(0);
      } else {
        // initialize client side emojis
        setClientEmojisShown([]);
        setEmojisToSend([]);
        setTimesClicked(0);
      }
    }
  }, [debouncedEmojis]);

  return (
    <ReactionsWrapper className={className} onMouseLeave={onMouseLeave}>
      <EmojiSpawner ref={emojiSpawnerRef} id="emoji-spawner">
        {clientEmojisShown.length > 0 &&
          clientEmojisShown.map((emojiAndCoordinate, index) => {
            const [emoji, xCoordenate] = emojiAndCoordinate;
            // random number or 0 or 1
            const fast = Math.random() < 0.5;
            return (
              <div
                className={fast ? 'emoji-fast' : 'emoji'}
                key={emoji + xCoordenate + index}
                style={{ left: xCoordenate - 20, position: 'absolute' }}
              >
                {EMOJIS[emoji].component}
              </div>
            );
          })}
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
