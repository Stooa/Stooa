/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('can click on screen share button', () => {
  cy.get('[data-testid=share-screen-button]').should('exist');
});
