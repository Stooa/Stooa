/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { gql } from '@apollo/client';

gql`
  mutation CreateResetPassword($input: createResetPasswordInput!) {
    createResetPassword(input: $input) {
      resetPassword {
        email
      }
    }
  }
`;

gql`
  mutation ChangePassword($input: changePasswordUserInput!) {
    changePasswordUser(input: $input) {
      user {
        email
      }
    }
  }
`;

gql`
  mutation ChangePasswordLogged($input: changePasswordLoggedUserInput!) {
    changePasswordLoggedUser(input: $input) {
      user {
        email
      }
    }
  }
`;
