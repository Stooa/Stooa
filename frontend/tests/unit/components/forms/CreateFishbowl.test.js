/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { render, screen} from '@testing-library/react';
import { CreateFishbowlForm } from '@/components/forms/CreateFishbowl';

// `describe` is not required, but it helps the tests read nicely
describe('Unit test of button join', () => {
  // Each test for the component will get an `it` block
  it('should render the `button`', () => {
    // The getByRole will error if there are less or more than 1 element found
    render(<CreateFishbowlForm />);

  });
});
