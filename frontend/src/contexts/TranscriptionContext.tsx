/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { TranscriptionsContextValues } from '@/types/contexts/transcriptions-context';
import createGenericContext from './createGenericContext';
import { SupportedLanguageTag } from '@/types/transcriptions';
import useTranslation from 'next-translate/useTranslation';
import { LOCALES } from '@/lib/supportedTranslationLanguages';
import { useState } from 'react';
import useEventListener from '@/hooks/useEventListener';
import { TRANSCRIPTION_TRANSCRIBER_JOINED } from '@/jitsi/Events';

const [useTranscriptions, TranscriptionsContextProvider] =
  createGenericContext<TranscriptionsContextValues>();

interface Props {
  children: React.ReactNode;
}

const TranscriptionsProvider = ({ children }: Props) => {
  const { lang } = useTranslation();
  const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState(false);
  const [isTranscriberJoined, setIsTranscriberJoined] = useState(false);
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(false);
  const [translationLanguage, setTranslationLanguage] = useState<SupportedLanguageTag>(
    LOCALES[lang]
  );
  const [selectedTranscriptionLanguage, setSelectedTranscriptionLanguage] = useState(LOCALES[lang]);

  useEventListener(TRANSCRIPTION_TRANSCRIBER_JOINED, ({ detail: { joined } }) => {
    setIsTranscriberJoined(joined);
  });

  return (
    <TranscriptionsContextProvider
      value={{
        isTranscriptionEnabled,
        setIsTranscriptionEnabled,
        isTranscriberJoined,
        setIsTranscriberJoined,
        isTranslationEnabled,
        setIsTranslationEnabled,
        translationLanguage,
        setTranslationLanguage,
        selectedTranscriptionLanguage,
        setSelectedTranscriptionLanguage
      }}
    >
      {children}
    </TranscriptionsContextProvider>
  );
};

export { useTranscriptions, TranscriptionsProvider };
