/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render, screen } from '@testing-library/react';

import { StateProvider } from '@/contexts/AppContext';
import Seats from '@/components/App/Seats';
import { IConferenceStatus } from '@/jitsi/Status';

import I18nProvider from 'next-translate/I18nProvider'

import appEN from 'locales/en/app.json'

const initialState = {
  fishbowlReady: false,
  fishbowlStarted: false,
  isGuest: false,
  prejoin: true,
  conferenceStatus: IConferenceStatus?.NOT_STARTED
};

describe('Unit test of fishbowl card at fishbowl list', () => {
  it('Fishbowl with all buttons visible', () => {
    render(
      <I18nProvider
    lang={'en'}
    namespaces={{
      app: appEN
      }}
    >
    <StateProvider value={[initialState]}>
      <Seats />
    </StateProvider>

  </I18nProvider>
    );

  });

});

