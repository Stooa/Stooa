/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ParticipantPlaceholder from '@/components/App/ParticipantPlaceholder';
import { render } from '@testing-library/react';

describe('Participant placeholder component', () => {
  it('It should render', async () => {
    const { getByTestId } = render(<ParticipantPlaceholder />);

    const participantPlaceholder = getByTestId('participant-placeholder');

    expect(participantPlaceholder).toBeInTheDocument();
  });
});
