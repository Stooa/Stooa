/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('a list of multiple finished fishbowls', () => {
  cy.intercept(
    {
      pathname: '/fishbowls'
    },
    { fixture: 'multiple-finished-fishbowl-list.json' }
  ).as('getMultipleFinishedFishbowlsListQuery');
});

Then('sees the fishbowl list page with multiple finished fishbowls', () => {
  cy.wait('@getMultipleFinishedFishbowlsListQuery');

  cy.get('[data-testid=count]').should('contain', '3');

  cy.get('[data-testid=finished-fishbowl-title]').eq(0).should('contain', 'First fishbowl');
  cy.get('[data-testid=finished-fishbowl-title]').eq(1).should('contain', 'Second fishbowl');
  cy.get('[data-testid=finished-fishbowl-title]').eq(2).should('contain', 'Third fishbowl');
});

Then('sees the finished fishbowl details', () => {
  cy.wait('@getMultipleFinishedFishbowlsListQuery');

  cy.get('[data-testid=finished-fishbowl-name]').should('contain', 'First fishbowl');
  cy.get('[data-testid=finished-fishbowl-description]').should(
    'contain',
    'Ratione et maiores itaque ut debitis.'
  );
  cy.get('[data-testid=finished-fishbowl-participant-count]').should('contain', '2');
  cy.get('[data-testid=finished-fishbowl-participant-name]')
    .eq(0)
    .should('contain', 'Linwood Hahn');
  cy.get('[data-testid=finished-fishbowl-participant-name]')
    .eq(1)
    .should('contain', 'Guest user name');

  cy.get('[data-testid=feedback-name]').should('contain', 'Guest user name');
  cy.get('[data-testid=feedback-email]').should('contain', 'guest@email.com');
  cy.get('[data-testid=feedback-satisfaction]').should('contain', 'sad');
  cy.get('[data-testid=feedback-summary-sad]').should('contain', '1');
});
