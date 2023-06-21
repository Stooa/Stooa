/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

When('clicks on its profile', () => {
  cy.get('header').within(() => {
    cy.findByRole('button', { name: 'Linwood Hahn' }).click({ force: true });
  });
});

Then('sees login and register buttons', () => {
  cy.get('header').within(() => {
    cy.screenshot();
    cy.findByRole('link', { name: 'Register for free' });
    cy.findByRole('link', { name: 'Log in' });
  });
});

Then('sees create fishbowl and profile buttons', () => {
  cy.get('header').within(() => {
    cy.screenshot();
    cy.findByRole('button', { name: 'Schedule a fishbowl' });
    cy.findByRole('button', { name: 'Linwood Hahn' });
  });
});

Then('sees the edit profile form', () => {
  cy.wait('@gqlSelfUserQuery');

  cy.findByRole('heading', { name: 'Edit profile' });

  cy.screenshot();
});

Then('sees the change password form', () => {
  cy.findByRole('heading', { name: 'Change password' });

  cy.screenshot();
});

Then('no longer sees its profile', () => {
  cy.get('header').within(() => {
    cy.findByRole('link', { name: 'Linwood Hahn' }).should('not.exist');
  });
});
