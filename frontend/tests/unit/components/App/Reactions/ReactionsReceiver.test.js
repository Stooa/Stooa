/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { act, render } from '@testing-library/react';
import ReactionsReceiver from '@/components/App/Reactions/ReactionsReceiver';

const sendReceivedEvent = reactionText => {
  const reactionReceivedEvent = new CustomEvent('reaction:received', {
    detail: { text: reactionText }
  });

  act(() => {
    dispatchEvent(reactionReceivedEvent);
  });
};

describe('Reactions receiver component', () => {
  it('It renders the component', () => {
    const { getByTestId } = render(<ReactionsReceiver />);
    const reactionsReceiver = getByTestId('reactions-receiver');

    expect(reactionsReceiver).toBeInTheDocument();
  });

  it('It shows one agree reaction', () => {
    const { getByTestId } = render(<ReactionsReceiver enabled="true" />);

    sendReceivedEvent('agree');

    const reactionToShow = getByTestId('reaction-to-show');

    expect(reactionToShow).toBeInTheDocument();
  });

  it('It shows one agree reaction', () => {
    const { getByTestId } = render(<ReactionsReceiver enabled="true" />);

    sendReceivedEvent('agree');

    const reactionToShow = getByTestId('reaction-to-show');

    expect(reactionToShow).toBeInTheDocument();
  });

  it('It shows one agree reaction', () => {
    const { getByTestId } = render(<ReactionsReceiver enabled="true" />);

    sendReceivedEvent('agree');

    const reactionToShow = getByTestId('reaction-to-show');

    expect(reactionToShow).toBeInTheDocument();
  });

  it('It shows 10 agree reactions', () => {
    const { getAllByTestId } = render(<ReactionsReceiver enabled="true" />);

    for (let count = 0; count < 10; count++) {
      sendReceivedEvent('agree');
    }

    const reactionsToShow = getAllByTestId('reaction-to-show');

    expect(reactionsToShow.length).toBe(10);
  });

  it('It shows 7 unique reactions', () => {
    const { getAllByTestId } = render(<ReactionsReceiver enabled="true" />);

    sendReceivedEvent('agree');
    sendReceivedEvent('disagree');
    sendReceivedEvent('love');
    sendReceivedEvent('applause');
    sendReceivedEvent('joy');
    sendReceivedEvent('wave');
    sendReceivedEvent('insightful');

    const reactionsToShow = getAllByTestId('reaction-to-show');

    expect(reactionsToShow.length).toBe(7);
  });

  it('It does not render when reaction is incorrect', () => {
    const { queryByTestId } = render(<ReactionsReceiver enabled="true" />);

    sendReceivedEvent('incorrect-reaction');

    const reactionsToShow = queryByTestId('reaction-to-show');

    expect(reactionsToShow).not.toBeInTheDocument();
  });
});
