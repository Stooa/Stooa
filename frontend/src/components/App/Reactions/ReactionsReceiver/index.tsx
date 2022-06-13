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
  const [reactionsToShow, setReactionsToShow] = useState<Reaction[]>([]);
  const [reactionsEnabled, SetreactionsEnabled] = useState(false);
  const REACTIONS_LIMIT = 1000;

  const reactionReceiverRef = useRef(null);

  const formatReactions = (reactions: string[]): Reaction[] => {
    const countReaction = reactions.length;
    const formattedReactions = reactions.map((reaction, index) =>
      Reactions.createReaction(
        reaction,
        `calc(${50 - countReaction * 1.2}% - 20px + ${index * 20}px)`
      )
    );

    return formattedReactions;
  };

  useEventListener(REACTION_MESSAGE_RECEIVED, ({ detail: { id, text, ts } }) => {
    if (reactionsToShow.length < REACTIONS_LIMIT && reactionsEnabled) {
      const splittedReactions: string[] = text.split(',');
      const formattedReactions: Reaction[] = formatReactions(splittedReactions);
      setReactionsToShow(reactions => [...reactions, ...formattedReactions]);
    }
  });

  useEffect(() => {
    let timeout;
    if (reactionsToShow.length > 0) {
      timeout = setTimeout(() => {
        setReactionsToShow([]);
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [reactionsToShow]);

  useEffect(() => {
    const enabledTimeout = setTimeout(() => {
      SetreactionsEnabled(true);
    }, 5000);

    return () => {
      clearTimeout(enabledTimeout);
    };
  }, [reactionsEnabled]);

  return (
    <StyledReactionsReciever ref={reactionReceiverRef}>
      {reactionsToShow.length > 0 &&
        reactionsToShow.map(mappedReaction => {
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
        })}
    </StyledReactionsReciever>
  );
};

export default ReactionsReceiver;
