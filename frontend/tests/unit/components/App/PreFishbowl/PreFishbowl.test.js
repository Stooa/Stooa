/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { fireEvent, render } from '@testing-library/react';
import PreFishbowl from '@/components/App/PreFishbowl';
import { useStooa } from '@/contexts/StooaManager';
import { IConferenceStatus, ITimeStatus } from '@/lib/jitsi-modules/Status';
import { makeCurrentFishbowl } from '../../../factories/fishbowl';
import { useRouter } from 'next/router';
import { pushEventDataLayer } from '@/lib/analytics';

jest.mock('@/lib/analytics');
jest.mock('next/router');
jest.mock('@/contexts/StooaManager');
jest.mock('@/components/App/PreFishbowl/PreFishbowlParticipants', () => () => (
  <mock-pre-fishbowl-participants data-testid="mock-participants" />
));
jest.mock('@/components/App/StatusBar/Counter', () => ({
  Counter: () => <mock-counter data-testid="mock-counter" />
}));

let currentFishbowl;

beforeEach(() => {
  currentFishbowl = makeCurrentFishbowl();

  useRouter.mockReturnValue({ query: { slug: currentFishbowl.slug } });

  useStooa.mockReturnValue({
    isModerator: false,
    data: currentFishbowl,
    toggleOnBoarding: jest.fn(),
    timeStatus: ITimeStatus.DEFAULT,
    conferenceStatus: IConferenceStatus.NOT_STARTED
  });
});

describe('Pre Fishbowl component', () => {
  it('Should render component', () => {
    const { getByTestId } = render(<PreFishbowl fishbowl={currentFishbowl} />);

    const preFishbowlComponent = getByTestId('pre-fishbowl');

    expect(preFishbowlComponent).toBeInTheDocument();

    const participantsComponent = getByTestId('mock-participants');

    expect(participantsComponent).toBeInTheDocument();

    const counterComponent = getByTestId('mock-counter');

    expect(counterComponent).toBeInTheDocument();

    const description = getByTestId('fishbowl-description');

    expect(description).toHaveTextContent(currentFishbowl.description);

    const name = getByTestId('fishbowl-name');

    expect(name).toHaveTextContent(currentFishbowl.name);
  });

  it('Should render component without description', () => {
    currentFishbowl.description = null;

    const { queryByTestId } = render(<PreFishbowl fishbowl={currentFishbowl} />);

    const description = queryByTestId('fishbowl-description');

    expect(description).not.toBeInTheDocument();
  });

  it('Should push event data layer been called on component render', () => {
    render(<PreFishbowl fishbowl={currentFishbowl} />);

    expect(pushEventDataLayer).toHaveBeenCalled();
  });

  it('Should push event data layer been called on click', () => {
    const { getByTestId } = render(<PreFishbowl fishbowl={currentFishbowl} />);

    const button = getByTestId('on-boarding-button');

    fireEvent.click(button);

    expect(pushEventDataLayer).toHaveBeenCalledTimes(2);
  });
});
