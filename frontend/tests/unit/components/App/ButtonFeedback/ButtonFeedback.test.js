/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { fireEvent, render } from '@testing-library/react';
import ButtonFeedback from '@/components/App/ButtonFeedback';

import { useStooa } from '@/contexts/StooaManager';

jest.mock('@/contexts/StooaManager');
jest.mock('@/components/App/FeedbackForm', () => () => <div data-testid="feedback-form" />);

describe('Unit test of feedback button', () => {
  it('It renders enabled feedback button when not feedback given yet and is not moderator', () => {
    useStooa.mockReturnValue({
      feedbackAlert: false,
      gaveFeedback: false,
      setGaveFeedback: () => jest.fn()
    });
    const { getByTestId } = render(<ButtonFeedback />);

    const button = getByTestId('feedback-button');
    expect(button).toBeInTheDocument();
  });

  it('Button is disabled when feedback given', () => {
    useStooa.mockReturnValue({
      feedbackAlert: false,
      gaveFeedback: true,
      setGaveFeedback: () => jest.fn()
    });
    const { getByTestId } = render(<ButtonFeedback disabled={true} />);

    const button = getByTestId('feedback-button');
    expect(button).toBeDisabled();
  });

  it('It shows the alert when not feedback given in the last 10minutes', () => {
    useStooa.mockReturnValue({
      feedbackAlert: true,
      gaveFeedback: false,
      setGaveFeedback: () => jest.fn()
    });
    const { getByTestId } = render(<ButtonFeedback />);

    const button = getByTestId('feedback-button');
    const alert = getByTestId('permission-alert');
    expect(button).toBeInTheDocument();
    expect(alert).toBeInTheDocument();
  });

  it('It shows the feedback form when clicking', () => {
    useStooa.mockReturnValue({
      feedbackAlert: true,
      gaveFeedback: false,
      setGaveFeedback: () => jest.fn()
    });
    const { getByTestId } = render(<ButtonFeedback />);
    const button = getByTestId('feedback-button');
    expect(button).toBeInTheDocument();

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    const form = getByTestId('feedback-form');
    expect(form).toBeInTheDocument();
  });
});
