/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { convertIntoClassName } from "@/lib/helpers";

When('clicks on {string} fishbowl title', (text = '', ) => {
  const className = text.replace(/\s/g , '-');

  cy.wait('@getOneFishbowlsListQuery');

  cy.get(`[data-cy=${className}]`).click({ force: true });
  cy.screenshot();
});

Then('sees the fishbowl edit form with {string} title', (text = '') => {

  cy.get('[data-testid=edit-form-title]').should('have.value', text);

  cy.screenshot();
});
