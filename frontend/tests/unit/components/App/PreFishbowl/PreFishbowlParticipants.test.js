/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render } from '@testing-library/react';
import PreFishbowlParticipants from '@/components/App/PreFishbowl/PreFishbowlParticipants';
import { useRouter } from 'next/router';
import { useStateValue } from '@/contexts/AppContext';
import { getApiParticipantList} from "@/repository/ApiParticipantRepository";

jest.mock('@/lib/analytics');
jest.mock('@/contexts/AppContext');
jest.mock('next/router');
jest.mock('@/repository/ApiParticipantRepository');

beforeEach(() => {
  useRouter.mockReturnValue({ query: { fid: 12345 } });
  useStateValue.mockReturnValue([{ isGuest: false }]);
  getApiParticipantList.mockReturnValue(new Promise(resolve => {
    setTimeout(() => resolve([]), 500);
  }));
});

describe('Pre Fishbowl Participants component', () => {
  it('Should render component', () => {
    const { getByTestId } = render(<PreFishbowlParticipants />);
  });
});
