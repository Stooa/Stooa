/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import OnBoardingTour from '@/components/App/OnBoardingTour';
import { render, waitFor } from '@testing-library/react';
import { makeCurrentFishbowl } from '../../../factories/fishbowl';
import { useStooa } from '@/contexts/StooaManager';
import { IConferenceStatus } from '@/lib/jitsi-modules/Status';
import OnBoardingTourCookie from '@/lib/OnBoardingTourCookie';

jest.mock('@/contexts/StooaManager');
jest.mock('@/lib/OnBoardingTourCookie');

beforeEach(() => {
  useStooa.mockReturnValue({
    isModerator: false,
    data: makeCurrentFishbowl(),
    conferenceReady: true,
    conferenceStatus: IConferenceStatus.RUNNING,
    showOnBoardingTour: true,
    setShowOnBoardingTour: () => true,
    setActiveOnBoardingTooltip: () => false
  });
  OnBoardingTourCookie.setOnBoardingCookie.mockReturnValue(true);
});

describe('On boarding tour component', () => {
  it('Should render component', async () => {
    const { getByTestId } = render(<OnBoardingTour />);

    await waitFor(() => {
      const onBoardingTourComponent = getByTestId('on-boarding-tour');
      expect(onBoardingTourComponent).toBeInTheDocument();
    });
  });
});
