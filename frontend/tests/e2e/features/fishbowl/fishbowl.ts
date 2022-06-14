/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Then } from 'cypress-cucumber-preprocessor/steps';
import { hasOperationName } from '../../utils/graphql-test-utils';
import { makeGQLTomorrowFishbowl } from '../../factories/fishbowl';

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

  cy.get('[data-test-id=fishbowl-name]').should('exist');
  cy.get('[data-test-id=fishbowl-name]').should('have.text', bySlugQueryFishbowl.name);

  cy.get('[data-test-id=fishbowl-description]').should('exist');
  cy.get('[data-test-id=fishbowl-description]').should(
    'have.text',
    bySlugQueryFishbowl.description
  );

  cy.screenshot();
});
