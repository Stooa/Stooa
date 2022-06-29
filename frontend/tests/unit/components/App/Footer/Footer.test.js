/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Footer from '@/components/App/Footer';
import { render } from '@testing-library/react';
import { useStooa } from '@/contexts/StooaManager';
import { useRouter } from 'next/router';
import { IConferenceStatus } from '@/jitsi/Status';

jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => null;
  DynamicComponent.displayName = 'LoadableComponent';
  DynamicComponent.preload = jest.fn();
  return DynamicComponent;
});

jest.mock('@/components/App/IntroNotification', () => () => (
  <div data-testid="intro-notification" />
));
jest.mock('@/components/App/ModeratorActions', () => () => <div data-testid="moderator-actions" />);
jest.mock('@/components/Common/Logo', () => () => <div data-testid="logo" />);
jest.mock('@/components/App/Toolbar', () => () => <div data-testid="toolbar"></div>);
jest.mock('@/contexts/StooaManager');
jest.mock('next/router');

describe('App footer component', () => {
  it("doesn't render because is not started", () => {
    useStooa.mockReturnValue({
      onIntroduction: false,
      isModerator: false,
      conferenceStatus: IConferenceStatus.NOT_STARTED
    });
    useRouter.mockReturnValue({ query: 'test-fid' });

    const { queryByTestId } = render(<Footer participantsActive={false} />);

    const introNotificationElement = queryByTestId('intro-notification');
    expect(introNotificationElement).not.toBeInTheDocument();
  });

  it("doesn't render because is admin but the fishbowl is in intro", () => {
    useStooa.mockReturnValue({
      onIntroduction: true,
      isModerator: true,
      conferenceStatus: IConferenceStatus.NOT_STARTED
    });
    useRouter.mockReturnValue({ query: 'test-fid' });

    const { queryByTestId } = render(<Footer participantsActive={false} />);

    const introNotificationElement = queryByTestId('intro-notification');
    expect(introNotificationElement).not.toBeInTheDocument();
  });

  it("doesn't render because the fishbowl is running", () => {
    useStooa.mockReturnValue({
      onIntroduction: false,
      isModerator: false,
      conferenceStatus: IConferenceStatus.RUNNING
    });
    useRouter.mockReturnValue({ query: 'test-fid' });

    const { queryByTestId } = render(<Footer participantsActive={false} />);

    const introNotificationElement = queryByTestId('intro-notification');
    expect(introNotificationElement).not.toBeInTheDocument();
  });

  it('renders because is not admin and the fishbowl is in intro', () => {
    useStooa.mockReturnValue({
      onIntroduction: true,
      isModerator: false,
      conferenceStatus: IConferenceStatus.NOT_STARTED
    });
    useRouter.mockReturnValue({ query: 'test-fid' });

    const { queryByTestId } = render(<Footer participantsActive={false} />);

    const introNotificationElement = queryByTestId('intro-notification');
    expect(introNotificationElement).toBeInTheDocument();
  });
});
