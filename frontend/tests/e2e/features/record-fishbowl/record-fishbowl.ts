/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Then, When } from 'cypress-cucumber-preprocessor/steps';

When('access to a current fishbowl', () => {
  cy.visit('/en/fb/test-fishbowl', {
    onBeforeLoad: win => {
      win.navigator.canShare = () => true;
      win.navigator.share = cy.stub().resolves(true);
      win.navigator.canShare = cy.stub().resolves(true);
    },
    timeout: 15000
  });

  cy.contains('Join discussion').click();
});

Then('can click on more options button', () => {
  cy.get('[data-testid=more-options-button]', { timeout: 10000 }).should('exist');
  cy.get('[data-testid=more-options-button]').click();
});

Then('can click on record button', () => {
  const recordingButton = cy.get('[data-testid=recording-button]', { timeout: 10000 });
  recordingButton.should('exist');
  recordingButton.click();
});

Then('can see start recording button from modal', () => {
  const button = cy.get('[data-testid=start-recording-button]');
  button.should('exist');
});
