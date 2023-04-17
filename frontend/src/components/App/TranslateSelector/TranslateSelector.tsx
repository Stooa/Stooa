/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useStooa } from '@/contexts/StooaManager';
import Conference from '@/jitsi/Conference';
import { LOCALES } from '@/lib/supportedTranslationLanguages';
import { useRouter } from 'next/router';
import { useState } from 'react';
import TranslationSwitcher from '../TranslationSwitcher';
import { StyledTranslate } from './styles';

const TranslateSelector = () => {
  const { locale } = useRouter();
  const { isTranslationEnabled, setIsTranslationEnabled } = useStooa();
  const [selectedTranslationLanguage, setSelectedTranslationLanguage] = useState<string>(
    LOCALES[locale || 'es']
  );

  const handleOnChange = () => {
    if (isTranslationEnabled) {
      setIsTranslationEnabled(false);
      Conference.stopTranslation();
      return;
    }

    setIsTranslationEnabled(true);
    Conference.setTranslationLanguage(selectedTranslationLanguage);
  };

  const handleChangedLanguage = (locale: string): void => {
    setSelectedTranslationLanguage(locale);
    Conference.setTranslationLanguage(locale);
  };

  const handleChangeTranscriptionLanguage = (locale: string): void => {
    Conference.setTranscriptionLanguage(locale);
  };

  return (
    <StyledTranslate>
      <TranslationSwitcher
        disabled={!isTranslationEnabled}
        changedLanguage={handleChangedLanguage}
      />
      <TranslationSwitcher changedLanguage={handleChangeTranscriptionLanguage} />
    </StyledTranslate>
  );
};

export default TranslateSelector;
