/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import preloadAll from 'jest-next-dynamic';

import Home from '@/pages/index';

const intersectionObserverMock = () => ({
  observe: () => null
});

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: ''
    };
  }
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth() {
    return {};
  }
}));

beforeAll(async () => {
  await preloadAll();
});

describe('Test of marketing landing page, with 4 listed benefits.', () => {
  it('Checking that all headings, benefits and buttons exist.', async () => {
    const { getByTestId, getAllByRole, queryAllByTestId } = render(<Home />);

    const {
      headingTitle,
      descriptionTitle,
      benefits,
      loginButton,
      registerButton,
      createFishbowlButton
    } = await waitFor(() => {
      const testElements = {
        headingTitle: getByTestId('landing-title'),
        descriptionTitle: getAllByRole('heading', { level: 2 })[0],
        benefits: queryAllByTestId(/benefit/i),
        loginButton: getByTestId('login'),
        registerButton: getByTestId('register'),
        createFishbowlButton: document.querySelectorAll('.cta-create-fishbowl')
      };

      return testElements;
    });

    expect(headingTitle).toBeInTheDocument();
    expect(descriptionTitle).toBeInTheDocument();
    expect(benefits).toHaveLength(4);
    expect(loginButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
    expect(createFishbowlButton).toHaveLength(2);
  });
});
