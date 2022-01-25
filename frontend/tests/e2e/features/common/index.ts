import { Then, When } from "cypress-cucumber-preprocessor/steps";

When('navigates to {string}', (url = '') => {
  cy.visit(url, { timeout: 10000 })
});

When('clicks on {string}', (text = '') => {
  cy.findAllByRole('link', { name: text }).first().click({ force: true })
});

Then('sees {string}', (text = '') => {
  cy.findByText(text).should('be.visible');
});

Then('gets redirect to {string}', (url = '') => {
  cy.location('pathname', { timeout: 10000 }).should('eq', url);
});
