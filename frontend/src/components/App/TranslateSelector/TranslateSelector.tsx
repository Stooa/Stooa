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
import LanguageTranscriptionSelector from '../LanguageTranscriptionSelector';
import { StyledSelectorWrapper } from './styles';
import useTranslation from 'next-translate/useTranslation';

const TranslateSelector = () => {
  const {
    isTranslationEnabled,
    setIsTranslationEnabled,
    isTranscriptionEnabled,
    translationLanguage,
    setTranslationLanguage
  } = useStooa();

  const { t } = useTranslation('fishbowl');

  const handleChangedLanguage = (locale: string): void => {
    Conference.setTranslationLanguage(locale);
    setTranslationLanguage(locale);
  };

  const handleActiveTranslate = (): void => {
    Conference.setTranslationLanguage(null);
    setIsTranslationEnabled(current => !current);
  };

  return (
    <StyledSelectorWrapper disabled={!isTranscriptionEnabled}>
      <div>
        <input
          name="translate"
          id="translate"
          type="checkbox"
          onChange={handleActiveTranslate}
        ></input>
        <label htmlFor="translate">{t('transcription.translate')}</label>
      </div>
      <LanguageTranscriptionSelector
        disabled={!isTranslationEnabled}
        propsSelectedLanguage={translationLanguage}
        changedLanguage={handleChangedLanguage}
      />
    </StyledSelectorWrapper>
  );
};

export default TranslateSelector;
