/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ChangeEvent, useCallback, useRef, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import usePersistLocaleCookie from '@/hooks/usePersistLocaleCookie';
import ChevronDown from '@/ui/svg/chevron-down.svg';

import Languages from '@/components/Common/LanguageSwitcher/styles';
import { SUPPORTED_LANGUAGE_TAGS } from '@/lib/supportedTranslationLanguages';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  changedLanguage?: (locale: string) => void;
  disabled?: boolean;
  propsSelectedLanguage?: string;
  location?: 'modal' | 'default';
}

const LanguageTranscriptionSelector = ({
  changedLanguage,
  disabled,
  propsSelectedLanguage,
  location = 'default',
  ...props
}: Props) => {
  const { lang } = useTranslation('common');
  const [selectedLanguage, setSelectedLanguage] = useState(propsSelectedLanguage || lang);
  const selectRef = useRef<HTMLSelectElement>(null);

  usePersistLocaleCookie();

  const getLanguageName = useCallback((languageTag: string) => {
    const languageNames = new Intl.DisplayNames([lang], {
      type: 'language'
    });
    const languageTagWithoutRegionCode = languageTag.toLowerCase().split(/[_-]+/)[0];
    const languageName = languageNames.of(languageTagWithoutRegionCode) || '';

    return languageName.charAt(0).toUpperCase() + languageName.slice(1);
  }, []);

  const changeLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target && event.target.value) {
      setSelectedLanguage(event.target.value);
      if (changedLanguage) changedLanguage(event.target.value);
    }
  };

  return (
    <Languages aria-disabled={disabled} location={location}>
      <select ref={selectRef} onChange={changeLanguage} value={selectedLanguage} {...props}>
        <option value={selectedLanguage}>{getLanguageName(selectedLanguage)}</option>
        {SUPPORTED_LANGUAGE_TAGS.map(lng => {
          return (
            <option value={lng} key={`lang-${lng}`}>
              {getLanguageName(lng)}
            </option>
          );
        })}
      </select>
      <ChevronDown />
    </Languages>
  );
};

export default LanguageTranscriptionSelector;
