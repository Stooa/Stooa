/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('can click on screen share button', () => {
  cy.get('[data-testid=share-screen-button]', { timeout: 6000 }).should('exist');
});
