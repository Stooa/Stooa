/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import OnBoardingTour from '@/components/App/OnBoardingTour';
import { render } from '@testing-library/react';
import {makeCurrentFishbowl} from "../../../factories/fishbowl";
import {useRouter} from "next/router";
import { useStooa } from '@/contexts/StooaManager';
import { IConferenceStatus, ITimeStatus } from '@/lib/jitsi-modules/Status';

jest.mock('@/contexts/StooaManager');

beforeEach(() => {
  useStooa.mockReturnValue({
    isModerator: false,
    data: makeCurrentFishbowl(),
    conferenceReady: true,
    conferenceStatus: IConferenceStatus.NOT_STARTED
  });
});

describe('On boarding tour component', () => {
  it('Should render component', () => {
    const { container } = render(<OnBoardingTour />);
    const onBoardingTourComponent = container.getElementsByClassName('on-boarding-tour');
  });
});
