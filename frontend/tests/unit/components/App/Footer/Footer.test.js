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
import preloadAll from 'jest-next-dynamic';

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (...props) => {
    const matchedPath = /(.)*(\'(.*)\')(.)*/.exec(props[0].toString());
    console.log(matchedPath[3]);
    if (matchedPath) return require(matchedPath[3]);
    else return () => <></>;
  }
}));

jest.mock('@/components/App/IntroNotification', () => () => (
  <div data-testid="intro-notification" />
));
jest.mock('@/components/App/ModeratorActions', () => {
  const DynamicComponent = () => <div data-testid="moderator-actions" />;
  DynamicComponent.displayName = 'LoadableComponent';
  DynamicComponent.preload = jest.fn();
  return DynamicComponent;
});
jest.mock('@/components/Common/Logo', () => {
  const DynamicComponent = () => <div data-testid="logo" />;
  DynamicComponent.displayName = 'LoadableComponent';
  DynamicComponent.preload = jest.fn();
  return DynamicComponent;
});

jest.mock('@/components/App/ToolBar', () => {
  const DynamicComponent = () => <div data-testid="toolbar" />;
  DynamicComponent.displayName = 'LoadableComponent';
  DynamicComponent.preload = jest.fn();
  return DynamicComponent;
});

jest.mock('@/contexts/StooaManager');
jest.mock('next/router');

beforeAll(async () => {
  await preloadAll();
});

describe('App footer component', () => {
  it("Intro Notification doesn't render because is not started", () => {
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

  it("Intro Notification doesn't render because is admin but the fishbowl is in intro", () => {
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

  it("Intro Notification doesn't render because the fishbowl is running", () => {
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

  it('Intro Notification renders because is not admin and the fishbowl is in intro', () => {
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

  it('Moderator actions renders properly when user is moderator', () => {
    useStooa.mockReturnValue({
      onIntroduction: true,
      isModerator: true,
      conferenceStatus: IConferenceStatus.NOT_STARTED
    });
    useRouter.mockReturnValue({ query: 'test-fid' });

    const { queryByTestId } = render(<Footer participantsActive={false} />);

    const introNotificationElement = queryByTestId('moderator-actions');
    expect(introNotificationElement).toBeInTheDocument();
  });

  it("Moderator actions doesn't render when user is not moderator", () => {
    useStooa.mockReturnValue({
      onIntroduction: true,
      isModerator: false,
      conferenceStatus: IConferenceStatus.NOT_STARTED
    });
    useRouter.mockReturnValue({ query: 'test-fid' });

    const { queryByTestId } = render(<Footer participantsActive={false} />);

    const introNotificationElement = queryByTestId('moderator-actions');
    expect(introNotificationElement).not.toBeInTheDocument();
  });

  it('Toolbar renders properly', () => {
    useStooa.mockReturnValue({
      onIntroduction: true,
      isModerator: false,
      conferenceStatus: IConferenceStatus.NOT_STARTED
    });
    useRouter.mockReturnValue({ query: 'test-fid' });

    const { queryByTestId } = render(<Footer participantsActive={false} />);

    const introNotificationElement = queryByTestId('toolbar');
    expect(introNotificationElement).toBeInTheDocument();
  });
});
