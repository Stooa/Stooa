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

const TranslateSelector = () => {
  const { isTranslationEnabled, setIsTranslationEnabled, isTranscriptionEnabled } = useStooa();

  const handleChangedLanguage = (locale: string): void => {
    Conference.setTranslationLanguage(locale);
  };

  const handleActiveTranslate = (): void => {
    Conference.setTranslationLanguage(null);
    setIsTranslationEnabled(!isTranslationEnabled);
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
        <label htmlFor="translate">Translate</label>
      </div>
      <LanguageTranscriptionSelector
        disabled={!isTranslationEnabled}
        changedLanguage={handleChangedLanguage}
      />
    </StyledSelectorWrapper>
  );
};

export default TranslateSelector;
