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
import { makeGQLCurrentFishbowl, makeGQLTomorrowFishbowl } from '../../factories/fishbowl';

const bySlugQueryTomorrowFishbowl = makeGQLTomorrowFishbowl();
const bySlugQueryCurrentFishbowl = makeGQLCurrentFishbowl();

When('navigates to future fishbowl', () => {
  cy.intercept('GET', 'https://localhost:8443/en/fishbowl-status/test-fishbowl', {
    statusCode: 200,
    body: {
      status: 'NOT_STARTED'
    }
  });

  cy.intercept('POST', 'https://localhost:8443/graphql', req => {
    if (hasOperationName(req, 'BySlugQueryFishbowl')) {
      req.reply({
        data: {
          bySlugQueryTomorrowFishbowl
        }
      });
    }
  }).as('gqlFishbowlBySlugQuery');

  cy.visit('/fb/test-fishbowl');
});

When('navigates to fishbowl', () => {
  cy.setCookie('share_link', bySlugQueryCurrentFishbowl.slug);
  cy.setCookie('on_boarding_moderator', 'true');

  cy.intercept('GET', 'https://localhost:8443/en/fishbowl-status/test-fishbowl', {
    statusCode: 200,
    body: {
      status: 'NOT_STARTED'
    }
  });

  cy.intercept('POST', 'https://localhost:8443/graphql', req => {
    if (hasOperationName(req, 'BySlugQueryFishbowl')) {
      req.reply({
        data: {
          bySlugQueryCurrentFishbowl
        }
      });
    }
  }).as('gqlFishbowlBySlugQuery');

  cy.visit('/fb/test-fishbowl');
});

Then('sees tomorrow fishbowl information page', () => {
  cy.wait('@gqlFishbowlBySlugQuery');

  cy.get('[data-testid=fishbowl-name]').should('exist');
  cy.get('[data-testid=fishbowl-name]').should('have.text', bySlugQueryTomorrowFishbowl.name);

  cy.get('[data-testid=fishbowl-description]').should('exist');
  cy.get('[data-testid=fishbowl-description]').should(
    'have.text',
    bySlugQueryTomorrowFishbowl.description
  );

  cy.screenshot();
});

When('can access to pre fishbowl', () => {
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

  cy.get('[data-testid=pre-join-title]').should('exist');
  cy.get('[data-testid=pre-join-cancel]').should('exist');

  cy.screenshot();
});

When('sees the prefishbowl page', () => {
  cy.intercept('POST', 'https://localhost:8443/graphql', req => {
    if (hasOperationName(req, 'BySlugQueryFishbowl')) {
      req.reply({
        data: {
          bySlugQueryCurrentFishbowl
        }
      });
    }
  }).as('gqlFishbowlBySlugQuery');

  cy.wait('@gqlFishbowlBySlugQuery');

  cy.get('[data-testid=prefishbowl-counter]').should('exist');
  cy.get('[data-testid=prefishbowl-datacard]').should('exist');
  cy.get('[data-testid=prefishbowl-participants]').should('exist');

  cy.screenshot();
});

Then('finishes a fishbowl', () => {
  cy.intercept('GET', 'https://localhost:8443/en/fishbowl-status/test-fishbowl', {
    statusCode: 200,
    body: {
      status: 'FINISHED'
    }
  });

  cy.contains('End fishbowl').click();

  cy.wait(3500);

  cy.get('[data-testid=finished-fishbowl]').should('exist');
});
