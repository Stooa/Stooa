/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import {
  makeGQLCurrentFishbowl,
  makeGQLCurrentFishbowlWithIntroduction,
  makeGQLCurrentNotOwnedFishbowl,
  makeGQLCurrentPrivateFishbowl,
  makeGQLTomorrowFishbowl
} from '../../factories/fishbowl';
import { hasOperationName } from '../../utils/graphql-test-utils';

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
  hasIntroduction: false,
  isPrivate: false,
  plainPassword: ''
};

Given('a profile information', () => {
  cy.intercept('POST', 'https://localhost:8443/graphql', {
    fixture: 'self-user.json'
  }).as('gqlSelfUserQuery');
});

Given('a logged user', () => {
  cy.login();
});

Given('has host role', () => {
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
});

Given("doesn't have host role", () => {
  cy.intercept('POST', 'https://localhost:8443/graphql', req => {
    if (hasOperationName(req, 'IsCreatorOfFishbowl')) {
      req.reply({
        data: {
          isCreatorOfFishbowl: null
        }
      });
    }
  }).as('gqlIsCreatorOfFishbowl');
});

Given('a non logged user', () => {
  cy.logout();
});

When('navigates to {string}', (url: string) => {
  cy.visit(url, { timeout: 10000 });
});

When('clicks on {string} link', (text: string) => {
  cy.findAllByRole('link', { name: text }).first().click({ force: true });
});

When('clicks on {string} button', (text: string) => {
  cy.findAllByRole('button', { name: text }).first().click({ force: true });
});

When('clicks on {string}', (text: string) => {
  cy.contains(text).click();
});

When('clicks to close modal', () => {
  cy.get('button[class="close"]').click({ force: true });
});

/**
 * @param {string} newValue Is the user's input
 * @param {string} fieldName The field to select by name
 */
When('writes {string} in input {string}', (newValue: string, fieldName: string) => {
  cy.get(`:is(input, textarea, div)[name=${fieldName}]`).clear().type(newValue);
  modifiedValues[fieldName] = newValue;
});

/**
 * This function changes the value to a select type input
 * @param {string} fieldName
 * @param {string} newValue
 */
When('modifies the fishbowl {string} selecting {string}', (fieldName: string, newValue: string) => {
  cy.get(`select[name=${fieldName}]`).select(newValue);
  modifiedValues[fieldName] = newValue;
});

/**
 * This function changes the value to a checkbox type input
 * @param {string} fieldName
 */
When('modifies the fishbowl {string} to true', (fieldName: string) => {
  cy.get(`input[name=${fieldName}]`).click({ force: true });
  modifiedValues[fieldName] = true;
});

When('clicks submit button', () => {
  cy.get('form').submit();
});

Then('sees {string}', (text: string) => {
  cy.findByText(text).should('be.visible');

  cy.screenshot();
});

Then('gets redirect to {string}', (url: string) => {
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
    {
      'hydra:member': [
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
      ],
      'hydra:view': {
        'hydra:next': []
      },
      'hydra:totalItems': 1
    }
  ).as('getOneCloseFishbowlsListQuery');
});

Given('a desktop computer', () => {
  cy.viewport('macbook-15');
});

Given('a mobile device', () => {
  cy.viewport('iphone-6');
});

let startedFishbowl = false;
let finishedFishbowl = false;

Given('a fishbowl', () => {
  startedFishbowl = false;
  finishedFishbowl = false;

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
});

Given('a fishbowl with introduction', () => {
  startedFishbowl = false;
  finishedFishbowl = false;

  const bySlugQueryFishbowl = makeGQLCurrentFishbowlWithIntroduction();

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
});

Given('a future fishbowl', () => {
  startedFishbowl = false;
  finishedFishbowl = false;

  const bySlugQueryFishbowl = makeGQLTomorrowFishbowl();

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
});

Given('a not owned fishbowl', () => {
  startedFishbowl = false;
  finishedFishbowl = false;

  const bySlugQueryFishbowl = makeGQLCurrentNotOwnedFishbowl();

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
});

Given('a not owned started fishbowl', () => {
  startedFishbowl = true;
  finishedFishbowl = false;

  const bySlugQueryFishbowl = makeGQLCurrentNotOwnedFishbowl();

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
});

Given('a private fishbowl', () => {
  startedFishbowl = false;
  finishedFishbowl = false;

  const bySlugQueryPrivateFishbowl = makeGQLCurrentPrivateFishbowl();

  cy.setCookie('share_link', bySlugQueryPrivateFishbowl.slug);
  cy.setCookie('on_boarding_moderator', 'true');

  cy.intercept('POST', 'https://localhost:8443/graphql', req => {
    if (hasOperationName(req, 'BySlugQueryFishbowl')) {
      req.reply({
        data: {
          bySlugQueryFishbowl: bySlugQueryPrivateFishbowl
        }
      });
    }
  }).as('gqlFishbowlBySlugQuery');
});

When('starts fishbowl', () => {
  cy.contains('Start the fishbowl').click();
  startedFishbowl = true;

  cy.wait('@getFishbowlStatus');

  cy.get('[data-testid=finish-fishbowl]', { timeout: 10000 }).should('exist');

  cy.screenshot();
});

When('starts fishbowl with introduction', () => {
  cy.contains('Start introduction').click();

  cy.contains('Start your introduction').click();

  startedFishbowl = true;

  cy.screenshot();
});

When('navigates to fishbowl', () => {
  cy.intercept('GET', 'https://localhost:8443/en/fishbowl-status/test-fishbowl', req => {
    if (!startedFishbowl && !finishedFishbowl) {
      req.reply({
        status: 'NOT_STARTED'
      });
    } else if (startedFishbowl && !finishedFishbowl) {
      req.reply({
        status: 'RUNNING'
      });
    } else if (finishedFishbowl) {
      req.reply({
        status: 'FINISHED'
      });
    }
  }).as('getFishbowlStatus');

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

  cy.visit('/fb/test-fishbowl', { timeout: 10000 });
});

When('can access to pre join', () => {
  cy.get('[data-testid=pre-join-title]').should('exist');
  cy.get('[data-testid=pre-join-cancel]').should('exist');

  cy.screenshot();
});

When('sees the prefishbowl page', () => {
  const bySlugQueryFishbowl = makeGQLCurrentFishbowl();

  cy.intercept('POST', 'https://localhost:8443/graphql', req => {
    if (hasOperationName(req, 'BySlugQueryFishbowl')) {
      req.reply({
        data: {
          bySlugQueryFishbowl
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

When('sees the prefishbowl page with introduction', () => {
  cy.intercept('GET', 'https://localhost:8443/en/fishbowl-status/test-fishbowl', req => {
    req.reply({
      status: 'INTRODUCTION'
    });
  }).as('getIntroductionStatus');

  const bySlugQueryFishbowl = makeGQLCurrentFishbowlWithIntroduction();

  cy.intercept('POST', 'https://localhost:8443/graphql', req => {
    if (hasOperationName(req, 'BySlugQueryFishbowl')) {
      req.reply({
        data: {
          bySlugQueryFishbowl
        }
      });
    }
  }).as('gqlFishbowlBySlugQuery');

  cy.get('[data-testid=prefishbowl-counter]').should('exist');
  cy.get('[data-testid=prefishbowl-datacard]').should('exist');
  cy.get('[data-testid=prefishbowl-participants]').should('exist');

  cy.screenshot();
});

Then('finishes a fishbowl', () => {
  cy.contains('End fishbowl').click();
  finishedFishbowl = true;

  cy.wait('@getFishbowlStatus');

  cy.get('[data-testid=finished-fishbowl]', { timeout: 10000 }).should('exist');
});
