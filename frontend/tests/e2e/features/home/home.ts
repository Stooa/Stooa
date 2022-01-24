import { Then } from "cypress-cucumber-preprocessor/steps";

Then('sees the register form', () => {
  cy.findByRole('heading', { name: 'Register to get started' });
});
