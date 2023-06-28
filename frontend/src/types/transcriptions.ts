/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SUPPORTED_LANGUAGE_TAGS } from '@/lib/supportedTranslationLanguages';

export type TranscriptionMessageType = {
  messageId?: string;
  userId: string;
  userName: string;
  confidence: number;
  text: string;
};

export type SupportedLanguageTag = (typeof SUPPORTED_LANGUAGE_TAGS)[number];
