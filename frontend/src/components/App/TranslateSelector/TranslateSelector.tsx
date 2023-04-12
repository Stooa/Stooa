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
import Switch from '@/components/Common/Fields/updated/Switch';
import { useForm } from 'react-hook-form';

const TranslateSelector = () => {
  const { locale } = useRouter();
  const { isTranslationEnabled, setIsTranslationEnabled, isTranscriptionEnabled } = useStooa();
  const [selectedTranslationLanguage, setSelectedTranslationLanguage] = useState<string>(
    LOCALES[locale || 'es']
  );
  const { register } = useForm({ defaultValues: { translate: false } });

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
      <div className={isTranscriptionEnabled ? '' : 'disabled'}>
        <form>
          <Switch
            id="translate"
            label="Traducir"
            disabled={!isTranscriptionEnabled}
            {...register('translate', {
              onChange: () => {
                handleOnChange();
              }
            })}
          />
        </form>
      </div>
      <TranslationSwitcher
        disabled={!isTranslationEnabled}
        changedLanguage={handleChangedLanguage}
      />
      <TranslationSwitcher changedLanguage={handleChangeTranscriptionLanguage} />
    </StyledTranslate>
  );
};

export default TranslateSelector;
