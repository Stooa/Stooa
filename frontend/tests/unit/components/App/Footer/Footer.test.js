/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Footer from '@/components/App/Footer';
import { render, waitForElement } from '@testing-library/react';
import { useStooa } from '@/contexts/StooaManager';
import { useRouter } from 'next/router';
import { IConferenceStatus } from '@/jitsi/Status';
import preloadAll from 'jest-next-dynamic';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@/components/App/IntroNotification', () => () => (
  <div data-testid="intro-notification" />
));
jest.mock('@/components/App/ModeratorActions', () => () => <div data-testid="moderator-actions" />);
jest.mock('@/components/Common/Logo', () => () => <div data-testid="logo" />);
jest.mock('@/components/App/Toolbar', () => () => <div data-testid="toolbar" />);
jest.mock('@/contexts/StooaManager');
jest.mock('next/router');

beforeAll(async () => {
  await preloadAll();
});

describe('App footer component', () => {
  it("doesn't render because is not started", async () => {
    useStooa.mockReturnValue({
      onIntroduction: false,
      isModerator: false,
      conferenceStatus: IConferenceStatus.NOT_STARTED
    });
    useRouter.mockReturnValue({ query: 'test' });

    const { queryByTestId } = render(<Footer participantsActive={false} />);

    const lazyContent = await waitForElement(() => queryByTestId('intro-notification'));

    // const introNotificationElement = queryByTestId('intro-notification');
    // expect(introNotificationElement).not.toBeInTheDocument();
  });
});
