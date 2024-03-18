/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import LanguageTranscriptionSelector from '../LanguageTranscriptionSelector';
import { StyledSelectorWrapper } from './styles';
import useTranslation from 'next-translate/useTranslation';
import { useConference } from '@/jitsi/useConference';
import { useTranscriptions } from '@/contexts/TranscriptionContext';

const TranslateSelector = () => {
  const {
    isTranslationEnabled,
    setIsTranslationEnabled,
    isTranscriptionEnabled,
    translationLanguage,
    setTranslationLanguage
  } = useTranscriptions();

  const { setConferenceTranslationLanguage } = useConference();

  const { t } = useTranslation('fishbowl');

  const handleChangedLanguage = (locale: string): void => {
    setConferenceTranslationLanguage(locale);
    setTranslationLanguage(locale);
  };

  const handleActiveTranslate = (): void => {
    if (!isTranslationEnabled) {
      setConferenceTranslationLanguage(translationLanguage);
    } else {
      setConferenceTranslationLanguage(null);
    }
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
