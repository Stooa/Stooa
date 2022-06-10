/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useRef, useState } from 'react';
import useEventListener from '@/hooks/useEventListener';
import { REACTION_MESSAGE_RECEIVED } from '@/jitsi/Events';
import { StyledReactionsReciever } from './styles';
import { Reaction } from '@/types/reactions';
import { REACTION_EMOJIS } from '../ReactionsEmojis';
import Reactions from '@/lib/Reactions/Reactions';

const ReactionsReceiver = () => {
  const [reactionsToShow, setReactionsToShow] = useState<Reaction[][]>([]);

  const reactionReceiverRef = useRef(null);

  const formatReaction = (reaction: string, index: number): Reaction => {
    return Reactions.createReaction(reaction, `calc(${50}% - 20px)`);
  };

  useEventListener(REACTION_MESSAGE_RECEIVED, ({ detail: { id, text, ts } }) => {
    console.log('REACTION_MESSAGE_RECEIVED', id, text, ts);

    const formattedReactions: Reaction[] = text.split(',').map(formatReaction);

    setReactionsToShow(reactions => [...reactions, formattedReactions]);
  });

  useEffect(() => {
    let timeout;
    if (reactionsToShow.length > 0) {
      timeout = setTimeout(() => {
        setReactionsToShow(reactions => reactions.slice(1));
      }, 2000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [reactionsToShow]);

  return (
    <StyledReactionsReciever ref={reactionReceiverRef}>
      {reactionsToShow.length > 0 &&
        reactionsToShow.map(reaction => {
          return reaction.map(mappedReaction => {
            const { id, reaction, xCoordinate, yCoordinate, animation } = mappedReaction;
            return (
              <span
                style={{
                  position: 'absolute',
                  left: xCoordinate,
                  bottom: yCoordinate,
                  transformOrigin: 'center'
                }}
                className={animation}
                key={id}
              >
                {REACTION_EMOJIS[reaction]}
              </span>
            );
          });
        })}
    </StyledReactionsReciever>
  );
};

export default ReactionsReceiver;
