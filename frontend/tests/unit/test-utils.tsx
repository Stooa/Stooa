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
import formEN from 'locales/en/form.json';
import { I18nDictionary } from 'next-translate';

const Providers: FC = ({ children }) => {
  return (
    <I18nProvider lang={'en'} namespaces={{ formEN }}>
      {children}
    </I18nProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';
export { customRender as render };
