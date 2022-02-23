/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import I18nProvider from 'next-translate/I18nProvider'

import { CREATE_FISHBOWL } from '@/graphql/Fishbowl';
import FishbowlForm from '@/components/Web/Forms/FishbowlForm';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '/'
    };
  }
}));

const mocks = [
  {
    request: {
      query: CREATE_FISHBOWL
    },
    result: {
      data: {
        createFishbowl: {
          name: 'Mocked fishbowl',
          startDateTime: new Date(),
          duration: '01:00',
          description: 'Mocked description',
          locale: 'es',
          timezone: 'Europe/Madrid',
          hasIntroduction: false,
          isFishbowlNow: false
        }
      }
    }
  },
];

describe('Unit test of create fishbowl', () => {
  it('renderrs the Create Fishbowl form with all correct fields and a submit button', () => {
    render(
        <MockedProvider mocks={mocks}>
          <FishbowlForm />
        </MockedProvider>
    );

    screen.getByLabelText(/title/i);
    screen.getByLabelText(/description/i);
    screen.getByLabelText(/date/i);
  });
});
