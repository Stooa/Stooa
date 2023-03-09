/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import '@testing-library/cypress/add-commands';
import '@cypress/code-coverage/support';

export const userAuthToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjI2NDMyOTUzMzQsImV4cCI6MjY0MzI5ODkzNCwic3ViIjoibWVldC5qaXRzaSIsImlzcyI6ImFwaV9jbGllbnQiLCJhdWQiOlsiYXBpX2NsaWVudCJdLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwidXNlcm5hbWUiOiJob3N0QHN0b29hLmNvbSIsInJvb20iOiIiLCJjb250ZXh0Ijp7InVzZXIiOnsibmFtZSI6Ikxpbndvb2QgSGFobiIsImVtYWlsIjoiaG9zdEBzdG9vYS5jb20iLCJ0d2l0dGVyIjpudWxsLCJsaW5rZWRpbiI6bnVsbH19fQ.JenDfwBreCDrqbPyl5l323T7hpVnNIaMXqiskWszUEA';

Cypress.Commands.add('login', (authToken = userAuthToken) => {
  cy.setCookie('token', authToken);
});

Cypress.Commands.add('logout', () => {
  cy.clearCookie('token');
});
