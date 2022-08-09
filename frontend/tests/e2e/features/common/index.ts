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

export const modifiedValues = {
  title: '',
  hours: '',
  description: '',
  startDateTimeTz: new Date(),
  duration: '',
  durationFormatted: '',
  timezone: '',
  locale: '',
  language: '',
  hasIntroduction: false
};

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

When('clicks on {string}', (text = '') => {
  cy.contains(text).click();
});

When('clicks to close modal', () => {
  cy.get('button[class="close"]').click({ force: true });
});

/**
 * @param {string} newValue Is the user's input
 * @param {string} fieldName The field to select by name
 */
When('writes {string} in input {string}', (newValue = '', fieldName = '') => {
  cy.get(`:is(input, textarea, div)[name=${fieldName}]`).clear().type(newValue);
  modifiedValues[fieldName] = newValue;
});

/**
 * This function changes the value to a select type input
 * @param {string} fieldName
 * @param {string} newValue
 */
When('modifies the fishbowl {string} selecting {string}', (fieldName = '', newValue = '') => {
  cy.get(`select[name=${fieldName}]`).select(newValue);
  modifiedValues[fieldName] = newValue;
});

/**
 * This function changes the value to a checkbox type input
 * @param {string} fieldName
 */
When('modifies the fishbowl {string} to true', (fieldName = '') => {
  cy.get(`input[name=${fieldName}]`).click({ force: true });
  modifiedValues[fieldName] = true;
});

When('clicks submit button', () => {
  cy.get('form').submit();
});

Then('sees {string}', (text = '') => {
  cy.findByText(text).should('be.visible');

  cy.screenshot();
});

Then('gets redirect to {string}', (url = '') => {
  cy.location('pathname', { timeout: 10000 }).should('eq', url);
});

Then('sees the register form', () => {
  cy.findByRole('heading', { name: 'Register to get started' });

  cy.screenshot();
});

Then('sees the create fishbowl form', () => {
  cy.findByRole('heading', { name: 'Create a free fishbowl' });

  cy.screenshot();
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

Given('a fishbowl', () => {
  cy.intercept('GET', 'https://localhost:8443/en/fishbowl-status/test-fishbowl', {
    statusCode: 200,
    body: {
      status: 'NOT_STARTED'
    }
  });

  cy.intercept('GET', 'https://localhost:8443/en/ping/test-fishbowl', {
    statusCode: 200,
    body: {
      response: true
    }
  });

  cy.intercept('GET', 'https://localhost:8443/en/fishbowl-participants/test-fishbowl', {
    statusCode: 200,
    body: {
      response: []
    }
  });
});

When('starts fishbowl', () => {
  cy.contains('Start the fishbowl').click();

  cy.intercept('GET', 'https://localhost:8443/en/fishbowl-status/test-fishbowl', {
    statusCode: 200,
    body: {
      status: 'RUNNING'
    }
  }).as('runningFishbowl');

  cy.wait(1000);

  cy.get('[data-testid=finish-fishbowl]').should('exist');

  cy.screenshot();
});
