/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Then, When } from 'cypress-cucumber-preprocessor/steps';
import { hasOperationName } from '../../utils/graphql-test-utils';
import { makeGQLTomorrowFishbowl } from '../../factories/fishbowl';

When('navigates to future fishbowl', () => {
  cy.visit('/fb/test-fishbowl', { timeout: 10000 });
});

Then('sees tomorrow fishbowl information page', () => {
  const bySlugQueryFishbowl = makeGQLTomorrowFishbowl();

  cy.intercept('POST', 'https://localhost:8443/graphql', req => {
    if (hasOperationName(req, 'BySlugQueryFishbowl')) {
      req.reply({
        data: {
          bySlugQueryFishbowl
        }
      });
    }
  }).as('gqlFishbowlBySlugQuery');

  cy.get('[data-testid=fishbowl-name]').should('exist');
  cy.get('[data-testid=fishbowl-name]').should('have.text', bySlugQueryFishbowl.name);

  cy.get('[data-testid=fishbowl-description]').should('exist');
  cy.get('[data-testid=fishbowl-description]').should('have.text', bySlugQueryFishbowl.description);

  cy.screenshot();
});

Then('sees the prefishbowl page', () => {
  cy.get('[data-testid=prefishbowl-counter]').should('exist');
  cy.get('[data-testid=prefishbowl-datacard]').should('exist');
  cy.get('[data-testid=prefishbowl-participants]').should('exist');

  cy.screenshot();
});

Then('sees the password input', () => {
  cy.get('[data-testid=prejoin-password]').should('exist');

  cy.screenshot();
});

Then('writes the correct password', () => {
  cy.intercept('POST', 'https://localhost:8443/es/private-password/test-fishbowl', req => {
    req.reply({
      response: true
    });
  }).as('gqlPrivateFishbowlPassword');

  cy.get('[data-testid=prejoin-password]').type('stooa123');
  cy.get('[data-testid=prejoin-enterFishbowl]').click();

  cy.wait('@gqlPrivateFishbowlPassword');

  cy.screenshot();
});
