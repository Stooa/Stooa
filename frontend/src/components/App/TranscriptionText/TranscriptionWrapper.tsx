/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useDebounce from '@/hooks/useDebouce';
import useEventListener from '@/hooks/useEventListener';
import { TRANSCRIPTION_MESSAGE_RECEIVED } from '@/jitsi/Events';
import { TranscriptionMessageType } from '@/types/transcriptions';
import { useEffect, useRef, useState } from 'react';
import { receiveMessageOnPort } from 'worker_threads';
import { StyledTranscribedHistory } from './styles';
import { TranscriptedText } from './TranscriptedText';

const TranscriptionWrapper = () => {
  const [textToShow, setTextToShow] = useState({});
  const [messagesReceived, setMessagesReceived] = useState({});
  const [messageHistory, setMessageHistory] = useState<TranscriptionMessageType[]>([]);

  const historyRef = useRef<HTMLDivElement>(null);

  useEventListener(TRANSCRIPTION_MESSAGE_RECEIVED, ({ detail: { data } }) => {
    let messageToPush = {};
    if (!messagesReceived.hasOwnProperty(data.message_id)) {
      messageToPush = {
        [data.message_id]: {
          user_id: data.participant.id,
          user_name: data.participant.identity_name,
          confidence: data.transcript[0].confidence,
          text: data.transcript[0].text
        }
      };
      setMessagesReceived({ ...messagesReceived, ...messageToPush });
    }

    if (
      (messagesReceived[data.message_id] &&
        data.transcript[0].confidence >= messagesReceived[data.message_id].confidence) ||
      !data.is_interim
    ) {
      messageToPush = {
        [data.message_id]: {
          user_id: data.participant.id,
          user_name: data.participant.identity_name,
          confidence: data.transcript[0].confidence,
          text: data.transcript[0].text
        }
      };
      setMessagesReceived({ ...messagesReceived, ...messageToPush });
    }

    if (!data.is_interim) {
      const messageToStore = {
        message_id: data.message_id,
        user_id: data.participant.id,
        user_name: data.participant.identity_name,
        confidence: data.transcript[0].confidence,
        text: data.transcript[0].text
      };

      setMessageHistory(current => [...current, messageToStore]);
    }

    setTextToShow(messageToPush);
    // handleTextToShow(messagesToPush);
  });

  const sentText = useDebounce<object>(textToShow, 3000);

  useEffect(() => {
    if (Object.keys(sentText).length > 0) {
      setTextToShow({});
    }
  }, [sentText]);

  useEffect(() => {
    if (historyRef.current) {
      const messageElement = historyRef.current.querySelector('.messages');
      console.log('----> DIS', messageElement?.getBoundingClientRect());
      historyRef.current.scrollTo(0, messageElement?.getBoundingClientRect().height || 0);
    }
  }, [messagesReceived]);

  return (
    <>
      {Object.keys(textToShow).map(messageId => {
        return (
          <TranscriptedText
            key={messageId}
            messageId={messageId}
            messageData={textToShow[messageId]}
          />
        );
      })}
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
    </>
  );
};

export default TranscriptionWrapper;
