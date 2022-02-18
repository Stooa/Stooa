/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

When('clicks on fishbowl title', () => {
  cy.wait('@getOneFishbowlsListQuery');

  cy.get(`[data-cy=Fishbowl-title]`).click({ force: true });

  cy.screenshot();
});


Then('sees the fishbowl edit form full of information', () => {

  cy.get('[data-testid=edit-form-title]').should('have.value', 'Fishbowl title');
  cy.get('[data-testid=edit-form-description]').should('have.value', 'Fishbowl description');
  cy.get('input[name="day"]').should('have.value', '11/02/2022');

  cy.screenshot();
});

When('clicks on modify fishbowl button', () => {
  cy.get(`[data-testid=fishbowl-submit]`).click({ force: true });

  cy.screenshot();
});

Given('an updated fishbowl', () => {
  cy.intercept('POST', 'https://localhost:8443/graphql', {
    fixture: 'updated-fishbowl'
  }).as('gqlUpdateFishbowlMutation');
});

Then('sees the fishbowl edit form updated', () => {
  cy.wait('@gqlUpdateFishbowlMutation');

  cy.get('[data-testid=edit-form-title]').should('have.value', 'Fishbowl updated');

  cy.screenshot();
});
