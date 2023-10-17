/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { hasOperationName } from '../../utils/graphql-test-utils';

Given('a created Fishbowl', () => {
  cy.intercept('POST', '/graphql', req => {
    if (hasOperationName(req, 'CreateFishbowl')) {
      req.reply({ fixture: 'created-fishbowl.json' });
    }
  }).as('gqlCreateFishbowlMutation');
});

Given('a Fishbowl by slug', () => {
  cy.intercept('POST', '/graphql', req => {
    if (hasOperationName(req, 'BySlugQueryFishbowl')) {
      req.reply({ fixture: 'fishbowl-by-slug.json' });
    }
  }).as('gqlFishbowlBySlugQuery');
});

Then('sees the fishbowl created', () => {
  cy.wait('@gqlCreateFishbowlMutation');
});

Then('sees the fishbowl by query', () => {
  cy.wait('@gqlFishbowlBySlugQuery');

  cy.screenshot();
});
