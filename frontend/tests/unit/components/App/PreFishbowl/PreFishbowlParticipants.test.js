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

jest.mock('next/router');

beforeEach(() => {
  useRouter.mockReturnValue({ query: '12434' });
});

describe('Pre Fishbowl Participants component', () => {
  it('Should render component', () => {
    const { getByTestId } = render(<PreFishbowlParticipants />);
  });
});
