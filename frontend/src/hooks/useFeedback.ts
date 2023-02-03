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
import { useStooa } from '@/contexts/StooaManager';

const useFeedback = () => {
  const [createFeedback] = useMutation(CREATE_FEEDBACK);
  const [updateFeedback] = useMutation(UPDATE_FEEDBACK);
  const { data } = useStooa();
  const useCreateFeedback = () => {
    const satisfaction = 'sad';
    const participantId = userRepository.getUserParticipantId();
    const participant = `/participants/${participantId}`;
    const email = 'foo@foo.com';
    const comment = 'Lorem ipsum comment';
    const fishbowl = data.id;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const origin = 'fishbowl';

    createFeedback({
      variables: {
        input: {
          participant,
          fishbowl,
          satisfaction,
          comment,
          email,
          timezone,
          origin
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

  const useUpdateFeedback = () => {
    // @TODO GET FEEDBACK FIRST THEN UPDATE
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
    useCreateFeedback,
    useUpdateFeedback
  };
};

export default useFeedback;
