/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useEventListener from '@/hooks/useEventListener';
import { TRANSCRIPTION_MESSAGE_RECEIVED } from '@/jitsi/Events';
import { TranscriptionMessageType } from '@/types/transcriptions';
import { useEffect, useRef, useState } from 'react';
import { StyledTranscribedHistory } from './styles';

export const TranscriptionHistory = () => {
  const [messageHistory, setMessageHistory] = useState<TranscriptionMessageType[]>([]);

  const historyRef = useRef<HTMLDivElement>(null);

  useEventListener(TRANSCRIPTION_MESSAGE_RECEIVED, ({ detail: { data } }) => {
    if (!data.is_interim) {
      const messageToStore = {
        message_id: data.message_id,
        user_id: data.participant.id,
        user_name: data.participant.identity_name ? data.participant.identity_name : data.participant.name,
        confidence: data.transcript[0].confidence,
        text: data.transcript[0].text
      };

      setMessageHistory(current => [...current, messageToStore]);
    }
  });

  useEffect(() => {
    if (historyRef.current) {
      const messageElement = historyRef.current.querySelector('.messages');
      historyRef.current.scrollTo(0, messageElement?.getBoundingClientRect().height || 0);
    }
  }, [messageHistory]);

  return (
    <StyledTranscribedHistory ref={historyRef}>
      <div className="messages">
        {messageHistory.map(message => {
          return (
            <div className="message" key={message.message_id}>
              <h4>{message.user_name}: </h4>
              <p>{message.text}</p>
            </div>
          );
        })}
      </div>
    </StyledTranscribedHistory>
  );
};
