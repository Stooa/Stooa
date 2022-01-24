import { Then, When } from "cypress-cucumber-preprocessor/steps";

When('navigates to {string}', (url = '') => {
  cy.visit(url)
});

When('clicks on {string}', (text = '') => {
  cy.findAllByRole('link', { name: text }).first().click()
});

Then('sees {string}', (text = '') => {
  cy.findByText(text);
});

Then('gets redirect to {string}', (url = '') => {
  cy.location('pathname').should('eq', url);
});
