/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { aliasMutation, hasOperationName } from '../../utils/graphql-test-utils';

Given('a created Fishbowl', () => {
  cy.intercept('POST', 'https://localhost:8443/graphql', req => {
    if (hasOperationName(req, 'CreateFishbowl')) {
      req.reply({ fixture: 'created-fishbowl.json' });
    }
  }).as('gqlCreateFishbowlMutation');
});

Given('a Fishbowl by slug', () => {
  cy.intercept('POST', 'https://localhost:8443/graphql', req => {
    if (hasOperationName(req, 'BySlugQueryFishbowl')) {
      req.reply({ fixture: 'fishbowl-by-slug.json' });
    }
  }).as('gqlFishbowlBySlugQuery');
});

Then('sees the fishbowl created', () => {
  cy.wait('@gqlCreateFishbowlMutation');

  // cy.findByRole('heading', { name: 'Now what?' }).should('exist');
});

Then('sees the fishbowl by query', () => {
  cy.wait('@gqlFishbowlBySlugQuery');

  // cy.findByRole('heading', { name: 'Now what?' }).should('exist');
});

// Given('a created Fishbowl', () => {
//   cy.fixture('created-fishbowl.json').then(data => {
//     cy.intercept('POST', 'https://localhost:8443/graphql', req => {
//       if (hasOperationName(req, 'CreateFishbowl')) {
//         req.reply(res => {
//           res.body = data;
//         });
//       }
//     }).as('gqlCreateFishbowlMutation');
//   });
// });

// Given('a Fishbowl by slug', () => {
//   cy.fixture('fishbowl-by-slug.json').then(data => {
//     cy.intercept('POST', 'https://localhost:8443/graphql', req => {
//       if (hasOperationName(req, 'bySlugQueryFishbowl')) {
//         req.reply(res => {
//           res.body = data;
//         });
//       }
//     }).as('gqlFishbowlBySlugQuery');
//   });
// });
