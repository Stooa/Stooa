/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render } from '@testing-library/react';
import FeedbackList from '@/user/FeedbackList';
import { makeFeedback } from '../../../factories/feedbacks';

// mock component
jest.mock('@/user/SatisfactionSummary', () => () => <div />);

describe('Unit test of feedback list', () => {
  it('It renders feedback list', () => {
    const { getByTestId } = render(<FeedbackList feedbacks={[makeFeedback()]} />);
    const feedbackList = getByTestId('feedback-list');
    expect(feedbackList).toBeInTheDocument();
  });
});
