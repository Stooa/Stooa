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
const isoDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();

Given('a profile information', () => {
  cy.intercept('POST', 'https://localhost:8443/graphql', {
    fixture: 'self-user.json'
  }).as('gqlSelfUserQuery');
});

Given('a logged user', () => {
  cy.login();
});

Given('a non logged user', () => {
  cy.logout();
});

When('navigates to {string}', (url = '') => {
  cy.visit(url, { timeout: 10000 });
});

When('clicks on {string} link', (text = '') => {
  cy.findAllByRole('link', { name: text }).first().click({ force: true });
});

When('clicks on {string} button', (text = '') => {
  cy.findAllByRole('button', { name: text }).first().click({ force: true });
});

Then('sees {string}', (text = '') => {
  cy.findByText(text).should('be.visible');

  cy.screenshot();
});

Then('gets redirect to {string}', (url = '') => {
  cy.location('pathname', { timeout: 10000 }).should('eq', url);
});

Given('a list of one fishbowl', () => {
  cy.intercept(
    {
      pathname: '/fishbowls',
      query: {
        'finishDateTime[after]': isoDate
      }
    },
    { fixture: 'one-fishbowl-list.json' }
  ).as('getOneFishbowlsListQuery');
});
