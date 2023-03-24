/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import LanguageSwitcher from '@/components/Common/LanguageSwitcher';
import { useStooa } from '@/contexts/StooaManager';
import Conference from '@/jitsi/Conference';
import { LOCALES } from '@/lib/locales';
import { useRouter } from 'next/router';
import { StyledTranslate } from './styles';

const TranslateSelector = () => {
  const { isTranslationEnabled, setIsTranslationEnabled } = useStooa();
  const { locale } = useRouter();

  const handleOnChange = () => {
    setIsTranslationEnabled(current => !current);
    Conference.setTranslationLanguage(LOCALES[locale as string]);
  };

  const handleChangedLanguage = (locale: string): void => {
    Conference.setTranslationLanguage(LOCALES[locale]);
  };

  return (
    <StyledTranslate>
      <input type="checkbox" onChange={handleOnChange} checked={isTranslationEnabled} />
      <span>Traducir</span>
      <LanguageSwitcher disabled={!isTranslationEnabled} changedLanguage={handleChangedLanguage} />
    </StyledTranslate>
  );
};

export default TranslateSelector;
