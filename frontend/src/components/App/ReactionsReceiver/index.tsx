/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useEventListener from '@/hooks/useEventListener';
import { TEXT_MESSAGE_RECEIVED } from '@/jitsi/Events';
import { useState } from 'react';
import { StyledReactionsReciever } from './styles';

const ReactionsReceiver = () => {
  const [reactionsToShow, setReactionsToShow] = useState([]);

  useEventListener(TEXT_MESSAGE_RECEIVED, ({ detail: { id, text, ts } }) => {
    console.log('I Listened the message (o)(o)', text);

    const receivedReactions = text.split(',');
    setReactionsToShow(receivedReactions);
  });

  return (
    <StyledReactionsReciever id="reactions-receiver">
      {reactionsToShow.length > 0 &&
        reactionsToShow.map((reaction, index) => {
          return <span key={reaction + index}>{reaction}</span>;
        })}
    </StyledReactionsReciever>
  );
};

export default ReactionsReceiver;
