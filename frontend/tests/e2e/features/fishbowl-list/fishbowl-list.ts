/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('a list of fishbowl', () => {
  cy.intercept(
    {
      pathname: '/fishbowls',
      query: {
        'finishDateTime[after]': new Date().toISOString()
      }
    },
    { fixture: 'fishbowl-list.json' }
  ).as('getFishbowlsListQuery');
});

When('clicks on its profile', () => {
  cy.get('header').within(() => {
    cy.findByRole('button', { name: 'Linwood Hahn' }).click({ force: true });
  });
});

Then('sees the fishbowl list page', () => {
  cy.wait('@getFishbowlsListQuery');

  cy.get('[data-cy=scheduled-header]').should('exist');

  cy.screenshot();
});
