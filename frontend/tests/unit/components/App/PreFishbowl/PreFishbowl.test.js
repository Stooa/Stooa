/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {  render } from '@testing-library/react';
import PreFishbowl from "@/components/App/PreFishbowl";
import { useStooa } from '@/contexts/StooaManager';
import {IConferenceStatus, ITimeStatus} from "@/lib/jitsi-modules/Status";
import {makeCurrentFishbowl} from "../../../factories/fishbowl";
import { useRouter } from "next/router";

jest.mock('next/router');
jest.mock('@/contexts/StooaManager');
jest.mock('@/components/App/PreFishbowl/PreFishbowlParticipants', () => () => {
  return <mock-pre-fishbowl-participants />;
});

describe('Pre Fishbowl component', () => {
  it('It should render', async () => {

    useRouter.mockReturnValue({ query: 'test-fid' });

    useStooa.mockReturnValue({
      isModerator: false,
      toggleOnBoarding: jest.fn(),
      timeStatus: ITimeStatus.DEFAULT,
      conferenceStatus: IConferenceStatus.NOT_STARTED
    });

    const currentFishbowl = makeCurrentFishbowl();

    const { getByTestId } = render(<PreFishbowl fishbowl={currentFishbowl} />);

    const preFishbowlComponent = getByTestId('pre-fishbowl');

    expect(preFishbowlComponent).toBeInTheDocument();
  });
});
