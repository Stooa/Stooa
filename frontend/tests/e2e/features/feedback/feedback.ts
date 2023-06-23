/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
// import { hasOperationName } from '../../utils/graphql-test-utils';

Then('can click on the feedback button', () => {
  cy.get('[data-testid=feedback-button]').click();
});

Then('sees the end step', () => {
  cy.get('[data-testid=feedback-end-step]').should('be.visible');
});

When('clicks on the feedback button', () => {
  cy.get('[data-testid=feedback-button]').click();
});

When('sees the feedback form', () => {
  cy.get('[data-testid=feedback-form]').should('be.visible');
});

When('clicks the okay button', () => {
  cy.get('[data-testid=feedback-okay-button]').click();
});

When('sees the comment step', () => {
  cy.get('[data-testid=feedback-comment-step]').should('be.visible');
});

When('skips the comment step', () => {
  cy.get('[data-testid=skip-comment]').click();
});

When('writes in the comment step', () => {
  cy.get('[data-testid=feedback-comment-textarea]').type('This is a comment');
});

When('clicks on the comment send button', () => {
  cy.get('[data-testid=feedback-comment-send-button]').click();
});

When('clicks on the mail send button', () => {
  cy.get('[data-testid=feedback-mail-send-button]').click();
});

When('sees the mail step', () => {
  cy.get('[data-testid=feedback-mail-step]').should('be.visible');
});

When('writes in the mail step', () => {
  cy.get('[data-testid=feedback-mail-input]').type('mymail@mail.com');
});

When('skips the mail step', () => {
  cy.get('[data-testid=skip-mail]').click();
});
