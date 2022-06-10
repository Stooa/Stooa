/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useRef, useState } from 'react';
import useEventListener from '@/hooks/useEventListener';
import { REACTION_MESSAGE_RECEIVED } from '@/jitsi/Events';
import { StyledReactionsReciever } from './styles';
import { Reaction } from '@/types/reactions';
import { REACTION_EMOJIS } from '../ReactionsEmojis';

const ReactionsReceiver = () => {
  const [reactionsToShow, setReactionsToShow] = useState<Reaction[]>([]);

  const reactionReceiverRef = useRef(null);

  useEventListener(REACTION_MESSAGE_RECEIVED, ({ detail: { id, text, ts } }) => {
    console.log('I Listened the message (o)(o)', text);

    const receivedReactions = text.split(',');
    const formattedReactions = receivedReactions.map((reaction, index) => {
      const randomNumber = Math.floor(Math.random() * 25);
      const randomBoolean = Math.random() >= 0.5;
      return {
        emoji: reaction,
        xCoordinate: 20 + index * 20,
        yCoordinate: randomNumber,
        animation: randomBoolean ? 'emoji-fast' : 'emoji-standard'
      };
    });

    setReactionsToShow(formattedReactions);
  });

  return (
    <StyledReactionsReciever ref={reactionReceiverRef}>
      {reactionsToShow.length > 0 &&
        reactionsToShow.map((reaction, index) => {
          const { emoji, xCoordinate, yCoordinate, animation } = reaction;
          return <span key={emoji + index}>{REACTION_EMOJIS[emoji]}</span>;
        })}
    </StyledReactionsReciever>
  );
};

export default ReactionsReceiver;
