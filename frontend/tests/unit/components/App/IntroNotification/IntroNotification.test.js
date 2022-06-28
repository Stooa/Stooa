/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import IntroNotification from '@/components/App/IntroNotification';
import { fireEvent, render } from '@testing-library/react';

describe('Intro Notification component',() => {
  it('It should render and close when clicking cross button', async () => {
    const { getByTestId, getByRole } = render(<IntroNotification />);

    const introNotificationElement = getByTestId('intro-notification');

    expect(introNotificationElement).toBeInTheDocument();

    const closeButton = getByRole('button');
    fireEvent.click(closeButton);

    expect(introNotificationElement).not.toBeInTheDocument();
  }
  );
})
