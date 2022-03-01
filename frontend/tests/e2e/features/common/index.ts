/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

const twoHoursInMs = 1000 * 60 * 60 * 2;
const twentyMinutesInMs = 1000 * 60 * 20;
const date = new Date();

const isoDate = new Date(date.getTime() + twoHoursInMs);
const isoCloseDate = new Date(date.getTime() + twentyMinutesInMs);

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
        'finishDateTime[after]': isoDate.toISOString()
      }
    },
    { fixture: 'one-fishbowl-list.json' }
  ).as('getOneFishbowlsListQuery');
});

Given('a list of one fishbowl that is about to start', () => {
  console.log(new Date(date.getTime() + twentyMinutesInMs));
  cy.intercept(
    {
      pathname: '/fishbowls',
      query: {
        'finishDateTime[after]': isoCloseDate.toISOString()
      }
    },
    [
      {
        id: 'a34b3ba8-df6b-48f2-b41c-0ef612b432a7',
        type: 'Fishbowl',
        name: 'Fishbowl title',
        description: 'Fishbowl description',
        slug: 'test-me-fishbowl',
        timezone: 'Europe/Madrid',
        locale: 'en',
        host: '/users/2b8ccbf5-fbd8-4c82-9b61-44e195348404',
        currentStatus: 'not_started',
        participants: [],
        isFishbowlNow: false,
        hasIntroduction: false,
        startDateTimeTz: isoCloseDate,
        endDateTimeTz: isoDate,
        durationFormatted: '02:00'
      }
    ]
  ).as('getOneCloseFishbowlsListQuery');
});

Given('a desktop computer', () => {
  cy.viewport('macbook-15');
});

Given('a mobile device', () => {
  cy.viewport('iphone-6');
});
