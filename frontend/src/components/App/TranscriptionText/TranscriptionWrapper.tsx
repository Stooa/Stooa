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
  const { isTranslationEnabled, isTranscriptionEnabled, translationLanguage } = useStooa();

  const pushMessage = data => {
    const messageToPush = {
      [data.message_id]: {
        userId: data.participant.id,
        userName: data.participant.name,
        confidence: isTranslationEnabled && !data.transcript ? 0 : data.transcript[0].confidence,
        text: isTranslationEnabled && !data.transcript ? data.text : data.transcript[0].text
      }
    };
    setMessagesReceived({ ...messagesReceived, ...messageToPush });
  };

  const showSplittedMessage = data => {
    const splittedText = data.text.match(/.{1,85}/g);
    splittedText.forEach((text, index) => {
      setTimeout(() => {
        const messageToShow = {
          [data.participant.id]: {
            confidence: 0,
            text
          }
        };
        setTextToShow(currentMessages => ({ ...currentMessages, ...messageToShow }));
      }, 2500 * index);
    });
  };

  const showMessage = data => {
    const messageToShow = {
      [data.participant.id]: {
        confidence: isTranslationEnabled && !data.transcript ? 0 : data.transcript[0].confidence,
        text: isTranslationEnabled && !data.transcript ? data.text : data.transcript[0].text
      }
    };

    setTextToShow(currentMessages => ({ ...currentMessages, ...messageToShow }));
  };

  useEventListener(TRANSCRIPTION_MESSAGE_RECEIVED, ({ detail: { data } }) => {
    if (!isTranscriptionEnabled) {
      return;
    }

    if (
      (isTranslationEnabled && data.type !== 'translation-result') ||
      (!isTranslationEnabled && data.type === 'translation-result')
    ) {
      return;
    }

    if (isTranslationEnabled && translationLanguage !== data.language) {
      return;
    }

    if (!messagesReceived.hasOwnProperty(data.message_id)) {
      pushMessage(data);
    }

    if (
      (messagesReceived[data.message_id] &&
        data.transcript &&
        data.transcript[0]?.confidence >= messagesReceived[data.message_id].confidence) ||
      !data.is_interim
    ) {
      pushMessage(data);
    }

    if (isTranslationEnabled) {
      showSplittedMessage(data);
      return;
    }
    showMessage(data);
  });

  const sentText = useDebounce<object>(textToShow, 3000);

  useEffect(() => {
    if (Object.keys(sentText).length > 0) {
      setTextToShow({});
    }
  }, [sentText]);

  return (
    <>
      {Object.keys(textToShow).map(userId => {
        return <TranscriptedText key={userId} userId={userId} messageData={textToShow[userId]} />;
      })}
    </>
  );
};

export default TranscriptionWrapper;
