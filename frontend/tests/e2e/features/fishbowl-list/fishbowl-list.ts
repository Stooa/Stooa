/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('a profile information', () => {
  cy.intercept('POST', 'https://localhost:8443/graphql', {
    fixture: 'self-user.json'
  }).as('gqlSelfUserQuery');
});

When('clicks on its profile', () => {
  cy.get('header').within(() => {
    cy.findByRole('button', { name: 'Linwood Hahn' }).click({ force: true });
  });
});

Then('sees the fishbowl list page', () => {
  cy.get('[data-cy=scheduled-header]').should('exist');

  cy.screenshot();
});
