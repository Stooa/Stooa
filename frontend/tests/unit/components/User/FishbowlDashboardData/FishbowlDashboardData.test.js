/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render } from '@testing-library/react';

import { FishbowlDashboardData } from '@/user/FishbowlList/FishbowlDashboardData';
import { makeCurrentFishbowl, makePastFishbowl } from '../../../factories/fishbowl';
import useFeedback from '@/hooks/useFeedback';

jest.mock('@/hooks/useNavigatorType');
jest.mock('@/hooks/useFeedback');
jest.mock('@/user/SatisfactionSummary', () => () => <div />);
jest.mock('@/user/FeedbackList', () => () => <div data-testid="feedback-list" />);
jest.mock('@/user/DashboardParticipantsList', () => () => <div data-testid="participant-list" />);

const currentFishbowlWithFeedback = makePastFishbowl(true, true);
const currentFishbowlWithoutParticipants = makeCurrentFishbowl(false, false);

describe('Unit test of fishbowl Dashboard', () => {
  it('It renders fishbowl dashboard without the participant list', () => {
    useFeedback.mockReturnValue({
      createFeedback: jest.fn(),
      updateFeedback: jest.fn(),
      summarizeFeedbackSatisfacion: jest.fn()
    });

    const { getByTestId, queryByTestId } = render(
      <FishbowlDashboardData
        fishbowl={currentFishbowlWithoutParticipants}
        onClickBack={() => jest.fn()}
      />
    );
    const dashboard = getByTestId('fishbowl-dashboard-data');
    const feedbackList = queryByTestId('feedback-list');
    expect(dashboard).toBeInTheDocument();
    expect(feedbackList).not.toBeInTheDocument();
  });

  it('It renders fishbowl dashboard with feedback and participants ', () => {
    useFeedback.mockReturnValue({
      createFeedback: jest.fn(),
      updateFeedback: jest.fn(),
      summarizeFeedbackSatisfacion: jest.fn()
    });

    const { getByTestId } = render(
      <FishbowlDashboardData fishbowl={currentFishbowlWithFeedback} onClickBack={() => jest.fn()} />
    );
    const dashboard = getByTestId('fishbowl-dashboard-data');
    const feedbackList = getByTestId('feedback-list');
    const participantList = getByTestId('participant-list');
    expect(dashboard).toBeInTheDocument();
    expect(feedbackList).toBeInTheDocument();
    expect(participantList).toBeInTheDocument();
  });
});
