/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import setLanguage from 'next-translate/setLanguage';

import usePersistLocaleCookie from 'hooks/usePersistLocaleCookie';
import { GAEvent } from 'lib/analytics';
import i18nConfig from 'i18n';
import ChevronDown from 'ui/svg/chevron-down.svg';

import Languages from 'components/Common/LanguageSwitcher/styles';
const { locales } = i18nConfig;

const LanguageSwitcher = () => {
  const { t, lang } = useTranslation('common');
  usePersistLocaleCookie();

  const changeLanguage = async (event: any) => {
    const { value } = event.currentTarget;

    GAEvent({
      action: 'Language Change',
      category: 'Footer',
      label: value
    });

    await setLanguage(value);
  };

  return (
    <Languages>
      <select onChange={changeLanguage} value={lang}>
        <option value={lang}>{t(`languages.${lang}`)}</option>
        {locales
          .filter(l => l !== lang)
          .map(lng => (
            <option value={lng} key={`lang-${lng}`}>
              {t(`languages.${lng}`)}
            </option>
          ))}
      </select>
      <ChevronDown />
    </Languages>
  );
};

export default LanguageSwitcher;
