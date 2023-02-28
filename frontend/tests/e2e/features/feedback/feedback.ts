/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Then, When } from 'cypress-cucumber-preprocessor/steps';
import { hasOperationName } from '../../utils/graphql-test-utils';

Then('can click on the feedback button', () => {
  cy.get('[data-testid=feedback-button]').click();
});

Then('sees the feedback form', () => {
  cy.get('[data-testid=feedback-form]').should('be.visible');
});
