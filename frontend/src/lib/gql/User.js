/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($input: createUserInput!) {
    createUser(input: $input) {
      user {
        id
        name
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($input: updateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        name
        surnames
        hubspotCode
      }
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($input: deleteUserInput!) {
    deleteUser(input: $input) {
      user {
        id
      }
    }
  }
`;

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
    }
  }
`;

const GET_SELF_USER = gql`
  query SelfUser {
    selfUser {
      id
      name
      surnames
      email
      allowShareData
      linkedinProfile
      twitterProfile
      hubspotCode
    }
  }
`;

export { CREATE_USER, DELETE_USER, GET_USER, GET_SELF_USER, UPDATE_USER };
