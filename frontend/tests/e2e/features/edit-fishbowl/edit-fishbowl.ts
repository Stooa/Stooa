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

import { modifiedValues } from '../common';

const mockDate = '2030-02-11T10:48:22+01:00';

When('clicks on fishbowl card', () => {
  cy.wait('@getOneFishbowlsListQuery');

  cy.get(`[data-testid=Fishbowl-title]`).click({ force: true });

  cy.screenshot();
});

When('clicks on fishbowl card that is about to start', () => {
  cy.wait('@getOneCloseFishbowlsListQuery');

  cy.get(`[data-testid=Fishbowl-title]`).click({ force: true });
});

Then('sees the fishbowl edit form full of information', () => {
  cy.get('[data-testid=edit-form-title]').should('have.value', 'Fishbowl title');
  cy.get('[data-testid=edit-form-description]').should('have.value', 'Fishbowl description');
  cy.get('input[name="day"]').should('have.value', '11/02/2030');

  cy.screenshot();
});

When('saves the changes', () => {
  const mergedValues = {
    updateFishbowl: {
      fishbowl: {
        id: '/fishbowls/a34b3ba8-df6b-48f2-b41c-0ef612b432a7',
        description: modifiedValues.description,
        startDateTimeTz: mockDate,
        endDateTimeTz: mockDate,
        timezone: modifiedValues.timezone,
        duration: mockDate,
        hasIntroduction: modifiedValues.hasIntroduction,
        locale: modifiedValues.language,
        slug: 'test-fishbowl',
        isFishbowlNow: false,
        durationFormatted: modifiedValues.hours,
        name: modifiedValues.title,
        isPrivate: modifiedValues.isPrivate,
        plainPassword: modifiedValues.plainPassword
      }
    }
  };

  cy.intercept('POST', 'https://localhost:8443/graphql', req => {
    if (hasOperationName(req, 'UpdateFishbowl')) {
      req.reply({
        data: mergedValues
      });
    }
  }).as('gqlUpdateFishbowlMutation');

  cy.get('form').submit();
});

Then('sees the success message', () => {
  cy.wait('@gqlUpdateFishbowlMutation');

  cy.get('span.success-message-bottom').should('exist');
});

Then('sees the fishbowl list updated', () => {
  const startDateTime = new Date(mockDate);

  const month = startDateTime.toLocaleString('default', { month: 'long' });
  const day = startDateTime.toLocaleString('default', { day: 'numeric' });
  const time = startDateTime.toLocaleString('default', { hour: 'numeric', minute: 'numeric' });
  const year = startDateTime.toLocaleString('default', { year: 'numeric' });

  cy.get('[data-testid=fishbowl-list-wrapper] h4').eq(0).should('contain', modifiedValues.title);
  cy.get('[data-testid=fishbowl-list-wrapper] .card__date')
    .eq(0)
    .should('contain', `${month} ${day}, ${year}`);
  cy.get('[data-testid=fishbowl-list-wrapper] .card__time').eq(0).should('contain', time);

  cy.screenshot();
});

Then('sees the placeholder area', () => {
  cy.get('[data-testid=selected-placeholder]').should('exist');

  cy.screenshot();
});

Then('sees a placeholder with Enter Fishbowl button', () => {
  cy.get('[data-testid=started-enter-fishbowl]').should('exist');
});

Then('clicks on placeholders Enter Fishbowl link', () => {
  cy.get('[data-testid=started-enter-fishbowl]').click({ force: true });
});
