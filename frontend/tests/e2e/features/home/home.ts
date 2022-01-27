/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('sees the register form', () => {
  cy.findByRole('heading', { name: 'Register to get started' });

  cy.screenshot();
});

Then('sees the create fishbowl form', () => {
  cy.findByRole('heading', { name: 'Create a free fishbowl' });

  cy.screenshot();
});
