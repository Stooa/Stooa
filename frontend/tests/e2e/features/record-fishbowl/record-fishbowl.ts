/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Then, When } from 'cypress-cucumber-preprocessor/steps';

When('access to a current fishbowl', () => {
  cy.visit('/en/fb/test-fishbowl', { timeout: 15000 });

  cy.contains('Join discussion').click();
});

Then('can click on more options button', () => {
  cy.get('[data-testid=more-options-button]').should('exist');
  cy.get('[data-testid=more-options-button]').click();
});

Then('can click on record button', () => {
  cy.get('[data-testid=recording-button]').should('exist');
  cy.get('[data-testid=recording-button]').click();
});

Then('can click on start recording button from modal', () => {
  cy.get('[data-testid=start-recording-button]').should('exist');
});
