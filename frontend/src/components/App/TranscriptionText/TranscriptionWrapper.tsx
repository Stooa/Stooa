/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useStooa } from '@/contexts/StooaManager';
import useDebounce from '@/hooks/useDebouce';
import useEventListener from '@/hooks/useEventListener';
import { TRANSCRIPTION_MESSAGE_RECEIVED } from '@/jitsi/Events';
import { useEffect, useState } from 'react';
import { TranscriptedText } from './TranscriptedText';

const TranscriptionWrapper = () => {
  const [textToShow, setTextToShow] = useState({});
  const [messagesReceived, setMessagesReceived] = useState({});
  const { isTranslationEnabled, isTranscriptionEnabled } = useStooa();

  useEventListener(TRANSCRIPTION_MESSAGE_RECEIVED, ({ detail: { data } }) => {
    if (!isTranscriptionEnabled) {
      return;
    }

    if (isTranslationEnabled && data.type !== 'translation-result') {
      return;
    }

    let messageToPush = {};
    if (!messagesReceived.hasOwnProperty(data.message_id)) {
      messageToPush = {
        [data.message_id]: {
          userId: data.participant.id,
          userName: data.participant.name,
          confidence: isTranslationEnabled ? 0 : data.transcript[0].confidence,
          text: isTranslationEnabled ? data.text : data.transcript[0].text
        }
      };
      setMessagesReceived({ ...messagesReceived, ...messageToPush });
    }

    if (
      (messagesReceived[data.message_id] &&
        data.transcript[0]?.confidence >= messagesReceived[data.message_id].confidence) ||
      !data.is_interim
    ) {
      messageToPush = {
        [data.message_id]: {
          userId: data.participant.id,
          userName: data.participant.identity_name,
          ...(!isTranslationEnabled && { confidence: data.transcript[0].confidence }),
          text: isTranslationEnabled ? data.text : data.transcript[0].text
        }
      };
      setMessagesReceived({ ...messagesReceived, ...messageToPush });
    }

    setTextToShow(messageToPush);
  });

  const sentText = useDebounce<object>(textToShow, 3000);

  useEffect(() => {
    if (Object.keys(sentText).length > 0) {
      setTextToShow({});
    }
  }, [sentText]);

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
    </>
  );
};

export default TranscriptionWrapper;
