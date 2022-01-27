/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { gql } from '@apollo/client';

const RECOVER_PASSWORD = gql`
  mutation CreateResetPassword($input: createResetPasswordInput!) {
    createResetPassword(input: $input) {
      resetPassword {
        email
      }
    }
  }
`;

const RESET_PASSWORD = gql`
  mutation ChangePassword($input: changePasswordUserInput!) {
    changePasswordUser(input: $input) {
      user {
        email
      }
    }
  }
`;

const RESET_LOGGED_PASSWORD = gql`
  mutation ChangePasswordLogged($input: changePasswordLoggedUserInput!) {
    changePasswordLoggedUser(input: $input) {
      user {
        email
      }
    }
  }
`;

export { RECOVER_PASSWORD, RESET_PASSWORD, RESET_LOGGED_PASSWORD };
