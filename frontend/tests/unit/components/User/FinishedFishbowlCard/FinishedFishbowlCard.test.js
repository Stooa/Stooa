/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render } from '@testing-library/react';
import { convertIntoClassName } from '@/lib/helpers';
import FinishedFishbowlCard from '@/user/FishbowlList/FinishedFishbowlCard';

import { makeCurrentFishbowl } from '../../../factories/fishbowl';

import { useNavigatorType } from '@/hooks/useNavigatorType';
import useFeedback from '@/hooks/useFeedback';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter');

jest.mock('@/hooks/useNavigatorType');
jest.mock('@/hooks/useFeedback');
jest.mock('@/user/DoughnutChart', () => () => <div />);

const currentFishbowl = makeCurrentFishbowl();

describe('Unit test of finished fishbowl card', () => {
  useRouter.mockImplementation(() => ({
    query: ''
  }));

  const mockedHandle = jest.fn();

  useNavigatorType.mockReturnValue({
    deviceType: 'Desktop'
  });

  it('It renders finished fishbowl card without feedback data', () => {
    useFeedback.mockReturnValue({
      createFeedback: jest.fn(),
      updateFeedback: jest.fn(),
      summarizeFeedbackSatisfacion: jest.fn()
    });
    const { getByTestId } = render(
      <FinishedFishbowlCard fishbowl={currentFishbowl} selected={false} onClick={mockedHandle} />
    );
    const card = getByTestId(convertIntoClassName(currentFishbowl.name));
    expect(card).toBeInTheDocument();
  });

  it('It renders finished fishbowl card with feedback data', () => {
    useFeedback.mockReturnValue({
      createFeedback: jest.fn(),
      updateFeedback: jest.fn(),
      summarizeFeedbackSatisfacion: jest.fn(() => {
        return {
          neutral: 2,
          happy: 4,
          sad: 4
        };
      })
    });

    const { getByTestId } = render(
      <FinishedFishbowlCard fishbowl={currentFishbowl} selected={false} onClick={mockedHandle} />
    );
    const card = getByTestId(convertIntoClassName(currentFishbowl.name));
    const chartWrapper = getByTestId('chart-wrapper');
    expect(card).toBeInTheDocument();
    expect(chartWrapper).toBeInTheDocument();
  });
});
