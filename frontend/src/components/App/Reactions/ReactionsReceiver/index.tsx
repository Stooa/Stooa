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

interface Props {
  className?: string;
  enabled?: boolean;
}

const ReactionsReceiver = ({ className, enabled = false }: Props) => {
  const [reactionsToShow, setReactionsToShow] = useState<Reaction[]>([]);
  const [reactionsEnabled, setReactionsEnabled] = useState(enabled);
  const REACTIONS_LIMIT = 1000;

  const reactionReceiverRef = useRef(null);

  const formatReactions = (reactions: string[]): Reaction[] => {
    const countReaction = reactions.length;
    const formattedReactions: Reaction[] = [];

    reactions.forEach((reaction, index) => {
      if (REACTION_EMOJIS.hasOwnProperty(reaction)) {
        formattedReactions.push(
          Reactions.createReaction(
            reaction,
            `calc(50% - ${countReaction > 1 ? countReaction * 14 : 20}px + ${index * 22}px)`
          )
        );
      }
    });

    return formattedReactions;
  };

  useEventListener(REACTION_MESSAGE_RECEIVED, ({ detail: { text } }) => {
    if (reactionsToShow.length < REACTIONS_LIMIT && reactionsEnabled) {
      const splitReactions: string[] = text.split(',');
      const formattedReactions = formatReactions(splitReactions);
      setReactionsToShow(reactions => [...reactions, ...formattedReactions]);
    }
  });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (reactionsToShow.length > 0) {
      timeout = setTimeout(() => {
        setReactionsToShow([]);
      }, 4000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [reactionsToShow]);

  useEffect(() => {
    // CLEAN SVGs FROM DOM
    const enabledTimeout = setTimeout(() => {
      setReactionsEnabled(true);
    }, 5000);

    return () => {
      clearTimeout(enabledTimeout);
    };
  }, [reactionsEnabled]);

  return (
    <StyledReactionsReciever
      ref={reactionReceiverRef}
      className={className}
      data-testid="reactions-receiver"
    >
      {reactionsToShow.length > 0 &&
        reactionsToShow.map(mappedReaction => {
          if (mappedReaction) {
            const { id, reaction, xCoordinate, yCoordinate, animation } = mappedReaction;
            return (
              <span
                data-testid="reaction-to-show"
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
          }
        })}
    </StyledReactionsReciever>
  );
};

export default ReactionsReceiver;
