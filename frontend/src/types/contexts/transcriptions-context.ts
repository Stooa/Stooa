/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Dispatch, SetStateAction } from 'react';
import { SupportedLanguageTag } from '../transcriptions';

export interface TranscriptionsContextValues {
  isTranscriptionEnabled: boolean;
  setIsTranscriptionEnabled: Dispatch<SetStateAction<boolean>>;
  isTranscriberJoined: boolean;
  setIsTranscriberJoined: Dispatch<SetStateAction<boolean>>;
  isTranslationEnabled: boolean;
  setIsTranslationEnabled: Dispatch<SetStateAction<boolean>>;
  translationLanguage: SupportedLanguageTag;
  setTranslationLanguage: Dispatch<SetStateAction<SupportedLanguageTag>>;
  selectedTranscriptionLanguage: string;
  setSelectedTranscriptionLanguage: Dispatch<SetStateAction<string>>;
}
