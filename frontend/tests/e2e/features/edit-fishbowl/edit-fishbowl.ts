/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

When('clicks on fishbowl card', () => {
  cy.wait('@getOneFishbowlsListQuery');

  cy.get(`[data-testid=Fishbowl-title]`).click({ force: true });

  cy.screenshot();
});

Then('sees the fishbowl edit form full of information', () => {
  cy.wait(1000);
  cy.get('[data-testid=edit-form-title]').should('have.value', 'Fishbowl title');
  cy.get('[data-testid=edit-form-description]').should('have.value', 'Fishbowl description');
  cy.get('input[name="day"]').should('have.value', '11/02/2030');

  cy.screenshot();
});

When('modifies the fishbowl title', () => {
  cy.get('input[name="title"]').clear().type('Fishbowl updated');
});

When('saves the changes', () => {
  cy.get('form').submit();
});

Then('sees success message', () => {
  cy.get('[data-testid=edit-form-title]').should('have.value', 'Fishbowl title');
  cy.screenshot();
});

Given('an updated fishbowl', () => {
  cy.intercept('POST', 'https://localhost:8443/graphql', {
    fixture: 'updated-fishbowl'
  }).as('gqlUpdateFishbowlMutation');
});

Then('sees the fishbowl list updated', () => {
  cy.wait('@gqlUpdateFishbowlMutation');

  cy.get('[data-testid=fishbowl-list-wrapper] h4').eq(0).should('contain', 'Fishbowl updated');

  cy.screenshot();
});
