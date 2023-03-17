/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { gql } from '@apollo/client';

const CREATE_FEEDBACK = gql`
  mutation CreateFeedback($input: createFeedbackInput!) {
    createFeedback(input: $input) {
      feedback {
        id
      }
    }
  }
`;

const UPDATE_FEEDBACK = gql`
  mutation UpdateFeedback($input: updateFeedbackInput!) {
    updateFeedback(input: $input) {
      feedback {
        id
      }
    }
  }
`;

export { CREATE_FEEDBACK, UPDATE_FEEDBACK };
