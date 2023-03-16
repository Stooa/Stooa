/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render, waitFor } from '@testing-library/react';
import PreFishbowlParticipants from '@/components/App/PreFishbowl/PreFishbowlParticipants';
import { useStateValue } from '@/contexts/AppContext';
import { getApiParticipantList } from '@/repository/ApiParticipantRepository';
import { ping } from '@/user/auth';
import { makeFishbowlParticipant } from '../../../factories/fishbowlParticipant';

jest.mock('@/user/auth');
jest.mock('@/contexts/AppContext');
jest.mock('@/repository/ApiParticipantRepository');
jest.mock('@/components/App/ParticipantPlaceholder', () => () => (
  <mock-participant-placeholder data-testid="mock-placeholder" />
));
jest.mock('@/components/App/Participants/ParticipantCard', () => () => (
  <mock-participant-card data-testid="mock-participant-card" />
));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter');

useRouter.mockImplementation(() => ({
  query: { fid: '12345' }
}));

beforeEach(async () => {
  useStateValue.mockReturnValue([{ isGuest: false }]);
  getApiParticipantList.mockReturnValue(
    new Promise(resolve => {
      setTimeout(() => resolve([]), 100);
    })
  );
});

describe('Pre Fishbowl Participants component', () => {
  it('Should render component as guest user', () => {
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
    const { queryByTestId } = render(<PreFishbowlParticipants />);

    const preFishbowlRegister = queryByTestId('prefishbowl-register');
    expect(preFishbowlRegister).not.toBeInTheDocument();

    expect(getApiParticipantList).toHaveBeenCalled();

    expect(ping).toHaveBeenCalled();
  });

  it('Should render one participant', async () => {
    const newParticipant = makeFishbowlParticipant();

    getApiParticipantList.mockResolvedValue([newParticipant]);

    const { getByTestId } = render(<PreFishbowlParticipants />);

    const participantCard = await waitFor(() => getByTestId('mock-participant-card'));

    expect(participantCard).toBeInTheDocument();
  });

  it('Should render 10 participant', async () => {
    const newParticipant = makeFishbowlParticipant();

    getApiParticipantList.mockResolvedValue(Array(10).fill(newParticipant));

    const { getAllByTestId } = render(<PreFishbowlParticipants />);

    const participantCard = await waitFor(() => getAllByTestId('mock-participant-card'));

    expect(participantCard).toHaveLength(10);
  });
});
