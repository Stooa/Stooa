/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

When('access to a current fishbowl', () => {
  cy.visit('/en/fb/test-fishbowl', { timeout: 15000 });

  cy.contains('Join discussion').click();
});

Then('can click on reactions', () => {
  cy.get('[data-testid=reactions-button]').should('exist');

  cy.get('[data-testid=reactions-button]').click();

  cy.get('[data-testid=reactions-wrapper]').should('exist');
});
