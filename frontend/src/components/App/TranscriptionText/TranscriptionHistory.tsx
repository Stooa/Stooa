/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useStooa } from '@/contexts/StooaManager';
import useEventListener from '@/hooks/useEventListener';
import { TRANSCRIPTION_MESSAGE_RECEIVED } from '@/jitsi/Events';
import { TranscriptionMessageType } from '@/types/transcriptions';
import { useEffect, useRef, useState } from 'react';
import { StyledTranscribedHistory } from './styles';

export const TranscriptionHistory = () => {
  const [messageHistory, setMessageHistory] = useState<TranscriptionMessageType[]>([]);
  const { isTranslationEnabled, isTranscriptionEnabled } = useStooa();

  const historyRef = useRef<HTMLDivElement>(null);

  useEventListener(TRANSCRIPTION_MESSAGE_RECEIVED, ({ detail: { data } }) => {
    if (!isTranscriptionEnabled) {
      return;
    }

    if (isTranslationEnabled && data.type !== 'translation-result') {
      return;
    }

    if (!data.is_interim) {
      const messageToStore = {
        messageId: data.message_id,
        userId: data.participant.id,
        userName: data.participant.name,
        confidence: isTranslationEnabled ? 0 : data.transcript[0].confidence,
        text: isTranslationEnabled ? data.text : data.transcript[0].text
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
            <div className="message" key={message.messageId}>
              <h4>{message.userName}: </h4>
              <p>{message.text}</p>
            </div>
          );
        })}
      </div>
    </StyledTranscribedHistory>
  );
};
