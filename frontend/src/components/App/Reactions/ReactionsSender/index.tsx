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
import conferenceRepository from '@/jitsi/Conference';
import { Reaction } from '@/types/reactions';
import { REACTION_EMOJIS } from '../ReactionsEmojis';

interface Props {
  onMouseEnter?: (mouseEvent: React.MouseEvent) => void;
  onMouseLeave?: (mouseEvent: React.MouseEvent) => void;
  className?: string;
}

const ReactionsSender = ({ onMouseLeave, className }: Props) => {
  const [disableToSendEmojis, setDisableToSendEmojis] = useState(false);
  const [clientEmojisShown, setClientEmojisShown] = useState<Reaction[]>([]);
  const [timesClicked, setTimesClicked] = useState(0);
  const [lastLocationClicked, setLastLocationClicked] = useState<number>();

  // const [emojisToSend, setEmojisToSend] = useState<string[]>([]);
  const emojisToSendRef = React.useRef<string[]>([]);
  const emojiSpawnerRef = React.useRef<HTMLDivElement>(null);

  const debouncedEmojis = useDebounce<string[]>(emojisToSendRef.current, 600);

  // TODO: Probar a mover dentro del componente boton
  const spawnEmoji = (emojiToSpawn: string, xCoordinate: number): void => {
    const randomNumber = Math.floor(Math.random() * 15);
    setClientEmojisShown(emojis => [
      ...emojis,
      {
        emoji: emojiToSpawn,
        xCoordinate: xCoordinate + randomNumber,
        yCoordinate: 0,
        animation: 'emoji-standard'
      }
    ]);
  };

  const spawnEmojisBatch = (emojis): void => {
    const emojisWithCoordinates = emojis.map((emoji, index) => {
      const randomYPosition = Math.floor(Math.random() * 20);
      const fast = Math.random() >= 0.5;
      return {
        emoji,
        xCoordinate: lastLocationClicked - 100 + index * 20,
        yCoordinate: randomYPosition,
        animation: fast ? 'emoji-fast' : 'emoji-standard'
      };
    });

    setClientEmojisShown(emojisWithCoordinates);
    setDisableToSendEmojis(true);

    setTimeout(() => {
      setClientEmojisShown([]);
      setDisableToSendEmojis(false);
    }, 2000);
  };

  const handleClick = (mouseEvent: React.MouseEvent) => {
    const target = mouseEvent.currentTarget;
    const { x: xCoordinate } = target.getBoundingClientRect();
    const emojiCoordinate = xCoordinate + 20;

    if (target.id) {
      if (timesClicked < 10) {
        setTimesClicked(timesClicked => timesClicked + 1);
        spawnEmoji(target.id, emojiCoordinate);
      }

      emojisToSendRef.current = [...emojisToSendRef.current, target.id];
      setLastLocationClicked(emojiCoordinate);
    }
  };

  const handleOnMouseLeave = (mouseEvent: React.MouseEvent) => {
    setClientEmojisShown([]);
    onMouseLeave(mouseEvent);
  };

  useEffect(() => {
    if (debouncedEmojis.length > 0) {
      // Send here emojis to sendmessage jitsi
      const firstTenEmojis = debouncedEmojis.slice(0, 10);

      console.log('sending', firstTenEmojis);
      conferenceRepository.sendTextMessage(firstTenEmojis.join(','));

      if (timesClicked === 10) {
        spawnEmojisBatch(firstTenEmojis);
        emojisToSendRef.current = [];
        setTimesClicked(0);
      } else {
        // initialize client side emojis
        emojisToSendRef.current = [];
        setTimesClicked(0);
      }
    }
  }, [debouncedEmojis]);

  console.log('re-render');

  return (
    <ReactionsWrapper className={className} onMouseLeave={handleOnMouseLeave}>
      <EmojiSpawner ref={emojiSpawnerRef} id="emoji-spawner">
        {clientEmojisShown.length > 0 &&
          clientEmojisShown.map((emojiAndCoordinate, index) => {
            const { emoji, xCoordinate, yCoordinate, animation } = emojiAndCoordinate;
            return (
              <div
                className={animation}
                key={emoji + xCoordinate + index}
                style={{ position: 'absolute', left: xCoordinate - 20, bottom: yCoordinate }}
              >
                {REACTION_EMOJIS[emoji]}
              </div>
            );
          })}
      </EmojiSpawner>

      <EmojiReaction disabled={disableToSendEmojis} emoji="like" onClick={handleClick} />
      <EmojiReaction disabled={disableToSendEmojis} emoji="love" onClick={handleClick} />
      <EmojiReaction disabled={disableToSendEmojis} emoji="applause" onClick={handleClick} />
      <EmojiReaction disabled={disableToSendEmojis} emoji="laugh" onClick={handleClick} />
      <EmojiReaction disabled={disableToSendEmojis} emoji="wave" onClick={handleClick} />
      <EmojiReaction disabled={disableToSendEmojis} emoji="insightful" onClick={handleClick} />
      <EmojiReaction disabled={disableToSendEmojis} emoji="curious" onClick={handleClick} />
    </ReactionsWrapper>
  );
};

export default ReactionsSender;
