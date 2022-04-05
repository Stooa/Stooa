/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import I18nProvider from 'next-translate/I18nProvider';
import { I18nDictionary } from 'next-translate';

import commonEN from 'locales/en/common.json';

interface ProvidersProps {
  lang: string;
  namespaceFile: I18nDictionary;
}
//TODO: Fix this wrapper to use it anywhere adding lang and namespace as props
/**
 *
 * @param children the children of the component
 * @param lang string of the language
 * @param lang namespace and file of the dictionary
 * @returns
 */
const Providers: FC = ({ children }) => {
  return (
    <I18nProvider lang="en" namespaces={{ common: commonEN }}>
      {children}
    </I18nProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';
export { customRender as render };
