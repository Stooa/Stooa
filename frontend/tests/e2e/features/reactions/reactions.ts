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
import { makeGQLCurrentFishbowl } from '../../factories/fishbowl';

When('access to a current fishbowl', () => {
  const bySlugQueryFishbowl = makeGQLCurrentFishbowl();

  cy.setCookie('share_link', bySlugQueryFishbowl.slug);
  cy.setCookie('on_boarding_moderator', 'true');

  cy.intercept('POST', 'https://localhost:8443/graphql', req => {
    if (hasOperationName(req, 'BySlugQueryFishbowl')) {
      req.reply({
        data: {
          bySlugQueryFishbowl
        }
      });
    }
  }).as('gqlFishbowlBySlugQuery');

  cy.intercept('GET', 'https://localhost:8443/en/fishbowl-status/test-fishbowl', {
    statusCode: 200,
    body: {
      status: 'NOT_STARTED'
    }
  });

  cy.visit('/fb/test-fishbowl', { timeout: 10000 });

  cy.intercept('POST', 'https://localhost:8443/graphql', req => {
    if (hasOperationName(req, 'IsCreatorOfFishbowl')) {
      req.reply({
        data: {
          isCreatorOfFishbowl: {
            currentStatus: 'test-me-fishbowl'
          }
        }
      });
    }
  }).as('gqlIsCreatorOfFishbowl');

  cy.contains('Enter fishbowl').click();
});

Then('can click on reactions', () => {
  cy.get('[data-testid=reactions-button]').should('exist');

  cy.get('[data-testid=reactions-button]').click();

  cy.get('[data-testid=reactions-wrapper]').should('exist');
});
