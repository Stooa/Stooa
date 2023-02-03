/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useMutation } from '@apollo/client';
import { CREATE_FEEDBACK, UPDATE_FEEDBACK } from '@/graphql/Feedback';
import userRepository from '@/jitsi/User';

const useFeedback = () => {
  const [createFeedback] = useMutation(CREATE_FEEDBACK);
  const [updateFeedback] = useMutation(UPDATE_FEEDBACK);

  const create = () => {
    const satisfaction = 'sad';
    const participant = userRepository.getUserParticipantId();

    createFeedback({
      variables: {
        input: {
          satisfaction,
          participant
        }
      }
    })
      .then(res => {
        console.log('[STOOA] Create Feedback', res);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const update = () => {
    const satisfaction = 'happy';
    const participant = userRepository.getUserParticipantId();

    updateFeedback({
      variables: {
        input: {
          satisfaction,
          participant
        }
      }
    })
      .then(res => {
        console.log('[STOOA] Create Feedback', res);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return {
    create,
    update
  };
};

export default useFeedback;
