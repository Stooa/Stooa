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
import formEnglishTranslation from 'locales/en/form.json';
import commonEnglishTranslation from 'locales/en/common.json';
import { CREATE_FISHBOWL } from '@/graphql/Fishbowl';
import FishbowlForm from '@/components/Web/Forms/FishbowlForm';
import I18nProvider from 'next-translate/I18nProvider';

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

jest.mock('@tiptap/react', () => ({
  useEditor() {
    return {};
  }
}));

jest.mock('@/components/Common/RichEditor', () => () => {
  return <mock-modal data-testid="modal" />;
});

jest.mock('@/contexts/AuthContext', () => ({
  useAuth() {
    return {};
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
  }
];

describe('Unit test of create fishbowl', () => {
  it('It renders the Create Fishbowl form with all correct fields and a submit button', () => {
    render(
      <I18nProvider
        lang={'en'}
        namespaces={{ form: formEnglishTranslation, common: commonEnglishTranslation }}
      >
        <MockedProvider mocks={mocks}>
          <FishbowlForm />
        </MockedProvider>
      </I18nProvider>
    );

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description (optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Starts at')).toBeInTheDocument();
    expect(screen.getByLabelText('Duration')).toBeInTheDocument();
    expect(screen.getByLabelText('Time Zone')).toBeInTheDocument();
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
  });
});
