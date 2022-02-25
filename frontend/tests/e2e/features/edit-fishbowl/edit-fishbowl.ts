/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

const modifiedValues = {
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

When('clicks on fishbowl card', () => {
  cy.wait('@getOneFishbowlsListQuery');

  cy.get(`[data-testid=Fishbowl-title]`).click({ force: true });

  cy.screenshot();
});

Then('sees the fishbowl edit form full of information', () => {
  cy.wait(1000);
  cy.get('[data-testid=edit-form-title]').should('have.value', 'Fishbowl title');
  cy.get('[data-testid=edit-form-description]').should('have.value', 'Fishbowl description');
  cy.get('input[name="day"]').should('have.value', '11/02/2030');

  cy.screenshot();
});

When('modifies the fishbowl {string} writing {string}', (fieldName = '', newValue = '') => {
  cy.get(`:is(input, textarea, div)[name=${fieldName}]`).clear().type(newValue);
  modifiedValues[fieldName] = newValue;
});

When('modifies the fishbowl {string} selecting {string}', (fieldName = '', newValue = '') => {
  cy.get(`select[name=${fieldName}]`).select(newValue);
  modifiedValues[fieldName] = newValue;
  console.log(modifiedValues);
});

When('modifies the fishbowl {string} to true', (fieldName = '') => {
  cy.get(`input[name=${fieldName}]`).click({ force: true });
  modifiedValues[fieldName] = true;
});

When('saves the changes', () => {
  cy.get('form').submit();
});

Then('sees success message', () => {
  cy.get('[data-testid=edit-form-title]').should('have.value', 'Fishbowl title');
  cy.screenshot();
});

Given('an updated fishbowl', () => {
  console.log('Saura modified values', modifiedValues);
  const mergedValues = {
    data: {
      updateFishbowl: {
        fishbowl: {
          id: '/fishbowls/a34b3ba8-df6b-48f2-b41c-0ef612b432a7',
          description: modifiedValues.description,
          startDateTimeTz: modifiedValues.startDateTimeTz,
          timezone: 'Europe/Madrid',
          duration: '02:00',
          hasIntroduction: modifiedValues.hasIntroduction,
          locale: modifiedValues.language,
          slug: 'test-me-fishbowl',
          isFishbowlNow: false,
          durationFormatted: modifiedValues.hours,
          name: modifiedValues.title
        }
      }
    }
  };

  cy.intercept('POST', 'https://localhost:8443/graphql', mergedValues).as(
    'gqlUpdateFishbowlMutation'
  );
});

Then('sees the fishbowl list updated', () => {
  cy.wait('@gqlUpdateFishbowlMutation');

  cy.get('[data-testid=fishbowl-list-wrapper] h4').eq(0).should('contain', modifiedValues.title);
  // cy.get('[data-testid=fishbowl-list-wrapper] h4')
  //   .eq(0)
  //   .should('contain', modifiedValues.startDateTimeTz);
  cy.get('[data-testid=fishbowl-list-wrapper] .card__time')
    .eq(0)
    .should(
      'contain',
      new Date(modifiedValues.startDateTimeTz).toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric'
      })
    );

  cy.screenshot();
});

Then('sees the placeholder area', () => {
  cy.get('[data-testid=selected-placeholder]').should('exist');

  cy.screenshot();
});
