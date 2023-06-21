/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/// <reference types="@testing-library/cypress" />

import '@testing-library/cypress/add-commands';
import '@cypress/code-coverage/support';
import { userAuthToken } from './tokens';

Cypress.Commands.add('login', (authToken = userAuthToken) => {
  cy.setCookie('token', authToken);
});

Cypress.Commands.add('logout', () => {
  cy.clearCookie('token');
});
