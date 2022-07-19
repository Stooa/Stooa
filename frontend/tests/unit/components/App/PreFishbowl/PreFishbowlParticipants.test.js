/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {render} from '@testing-library/react';
import PreFishbowlParticipants from '@/components/App/PreFishbowl/PreFishbowlParticipants';
import { useRouter } from 'next/router';
import { useStateValue } from '@/contexts/AppContext';
import { getApiParticipantList } from '@/repository/ApiParticipantRepository';
import { ping } from '@/lib/auth';

jest.mock('@/lib/auth');
jest.mock('@/lib/analytics');
jest.mock('@/contexts/AppContext');
jest.mock('next/router');
jest.mock('@/repository/ApiParticipantRepository');
jest.mock('@/components/App/ParticipantPlaceholder', () => () => (
  <mock-participant-placeholder data-testid="mock-placeholder" />
));

beforeEach(() => {
  useRouter.mockReturnValue({ query: { fid: 12345 } });
});

const setParticipants = participants => {
  getApiParticipantList.mockReturnValue(
    new Promise(resolve => {
      setTimeout(() => resolve(participants), 500);
      useStateValue.mockReturnValue([{ isGuest: false }]);
    })
  );
};

describe('Pre Fishbowl Participants component', () => {
  it('Should render component as guest user', () => {
    setParticipants([]);

    useStateValue.mockReturnValue([{ isGuest: true }]);

    const { getByTestId, getAllByTestId } = render(<PreFishbowlParticipants />);

    const preFishbowlParticipants = getByTestId('prefishbowl-participants');
    expect(preFishbowlParticipants).toBeInTheDocument();

    const preFishbowlRegister = getByTestId('prefishbowl-register');
    expect(preFishbowlRegister).toBeInTheDocument();
    
    const placeholder = getAllByTestId('mock-placeholder');
    expect(placeholder).toHaveLength(10);

    expect(getApiParticipantList).toHaveBeenCalled();

    expect(ping).toHaveBeenCalled();
  });

  it('Should render component as host', () => {
    setParticipants([]);

    const { queryByTestId } = render(<PreFishbowlParticipants />);

    const preFishbowlRegister = queryByTestId('prefishbowl-register');
    expect(preFishbowlRegister).not.toBeInTheDocument();

    expect(getApiParticipantList).toHaveBeenCalled();

    expect(ping).toHaveBeenCalled();
  });
});
