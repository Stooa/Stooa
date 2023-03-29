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
import TranslationSwitcher from '../TranslationSwitcher';
import { StyledTranslate } from './styles';

const TranslateSelector = () => {
  const { isTranslationEnabled, setIsTranslationEnabled, isTranscriptionEnabled } = useStooa();
  const { locale } = useRouter();

  const handleOnChange = () => {
    if (isTranslationEnabled) {
      setIsTranslationEnabled(false);
      Conference.stopTranslation();
      return;
    }

    setIsTranslationEnabled(true);
    Conference.setTranslationLanguage(LOCALES[locale as string]);
  };

  const handleChangedLanguage = (locale: string): void => {
    Conference.setTranslationLanguage(locale);
  };

  return (
    <StyledTranslate>
      <div className={isTranscriptionEnabled ? '' : 'disabled'}>
        <input
          disabled={!isTranscriptionEnabled}
          type="checkbox"
          onChange={handleOnChange}
          checked={isTranslationEnabled}
        />
        <span>Traducir</span>
      </div>
      <TranslationSwitcher
        disabled={!isTranslationEnabled}
        changedLanguage={handleChangedLanguage}
      />
    </StyledTranslate>
  );
};

export default TranslateSelector;
