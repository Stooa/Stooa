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
  const [clientEmojisShown, setClientEmojisShown] = useState<
    { emoji: string; xCoordenate: number; yCoordenate: number; animation: string }[]
  >([]);
  const [timesClicked, setTimesClicked] = useState(0);
  const [lastLocationClicked, setLastLocationClicked] = useState<number>();

  const debouncedEmojis = useDebounce<string[]>(emojisToSend, 600);
  const emojiSpawnerRef = React.useRef<HTMLDivElement>(null);

  const spawnEmoji = (emojiToSpawn: string, xCoordenate: number): void => {
    const randomNumber = Math.floor(Math.random() * 10);
    setClientEmojisShown(emojis => [
      ...emojis,
      {
        emoji: emojiToSpawn,
        xCoordenate: xCoordenate + randomNumber,
        yCoordenate: 0,
        animation: 'emoji'
      }
    ]);
  };

  const spawnEmojisBatch = (emojis): void => {
    const emojisWithCoordenates = emojis.map((emoji, index) => {
      const randomNumber = Math.floor(Math.random() * 10);
      const fast = Math.random() >= 0.5;
      return {
        emoji,
        xCoordenate: lastLocationClicked - 100 + index * 20,
        yCoordenate: randomNumber,
        animation: fast ? 'emoji-fast' : 'emoji'
      };
    });

    setClientEmojisShown(emojisWithCoordenates);

    setTimeout(() => {
      setClientEmojisShown([]);
    }, 2000);
  };

  const handleClick = (mouseEvent: React.MouseEvent) => {
    const target = mouseEvent.currentTarget;
    const { x: xCoordinate } = target.getBoundingClientRect();
    const emojiCoordinate = xCoordinate + 20;

    if (target.id) {
      //client side
      if (timesClicked < 10) {
        setTimesClicked(timesClicked => timesClicked + 1);
        spawnEmoji(target.id, emojiCoordinate);
      }

      //server side
      setEmojisToSend(emojisToSend => [...emojisToSend, target.id]);

      setLastLocationClicked(emojiCoordinate);
    }
  };

  useEffect(() => {
    if (debouncedEmojis.length > 0) {
      // Send here emojis to sendmessage jitsi
      console.log('only debounced');

      console.log('sending', debouncedEmojis.slice(0, 10));
      if (timesClicked === 10) {
        spawnEmojisBatch(debouncedEmojis.slice(0, 10));
        setEmojisToSend([]);
        setTimesClicked(0);
      } else {
        // initialize client side emojis
        setTimeout(() => {
          setClientEmojisShown([]);
        }, 2000);

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
            const { emoji, xCoordenate, yCoordenate, animation } = emojiAndCoordinate;
            return (
              <div
                className={animation}
                key={emoji + xCoordenate + index}
                style={{ position: 'absolute', left: xCoordenate - 20, bottom: yCoordenate }}
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
