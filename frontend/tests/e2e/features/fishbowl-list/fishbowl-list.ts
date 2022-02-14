/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

const date = new Date();
const standarizedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();

Given('a list of fishbowls', () => {
  cy.intercept(
    {
      pathname: '/fishbowls',
      query: {
        'finishDateTime[after]': standarizedDate
      }
    },
    { fixture: 'fishbowl-list.json' }
  ).as('getFishbowlsListQuery');
});

Given('a list of empty fishbowls', () => {
  cy.intercept(
    {
      pathname: '/fishbowls',
      query: {
        'finishDateTime[after]': standarizedDate
      }
    },
    []
  ).as('getEmptyFishbowlsListQuery');
});

When('clicks on its profile', () => {
  cy.get('header').within(() => {
    cy.findByRole('button', { name: 'Linwood Hahn' }).click({ force: true });
  });
});

Then('sees the fishbowl list page', () => {
  cy.wait('@getFishbowlsListQuery');

  cy.get('[data-cy=scheduled-header]').should('exist');
  cy.get('[data-cy=count]').should('contain', '1');

  cy.screenshot();
});

Then('sees the empty fishbowl list page', () => {
  cy.wait('@getEmptyFishbowlsListQuery');

  cy.get('[data-cy=scheduled-header]').should('exist');
  cy.get('[data-cy=empty-list]').should('exist');
  cy.get('[data-cy=count]').should('contain', '0');

  cy.screenshot();
});
