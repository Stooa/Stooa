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
import { getAuthToken } from '@/user/auth';
import api from '@/lib/api';
import { Feedback } from '@/types/api-platform/interfaces/feedback';

const useFeedback = () => {
  const [createFeedbackMutation] = useMutation(CREATE_FEEDBACK);
  const [updateFeedbackMutation] = useMutation(UPDATE_FEEDBACK);
  const { data } = useStooa();

  const createFeedback = () => {
    const satisfaction = 'sad';
    const participant = userRepository.getUserParticipantId();
    const fishbowl = data.id;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const origin = 'fishbowl';

    createFeedbackMutation({
      variables: {
        input: {
          participant,
          fishbowl,
          satisfaction,
          timezone,
          origin
        }
      }
    })
      .then(res => {
        const {
          data: {
            createFeedback: { feedback }
          }
        } = res;

        if (feedback.id) {
          userRepository.setUserFeedbackId(feedback.id);
        }

        console.log('[STOOA] Create Feedback', res);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getFeedback = async (): Promise<Feedback | null> => {
    const auth = await getAuthToken();
    const feedbackId = userRepository.getUserFeedbackId();

    api
      .get(feedbackId, {
        headers: {
          authorization: `${auth ? auth.authorizationString : null}`
        }
      })
      .then(response => {
        if (response.data) {
          console.log('[STOOA] Get feedback', response.data);
          return response.data;
        }
      })
      .catch(error => {
        console.error('[STOOA] Get Feedback error', error);
      });

    return null;
  };

  const updateFeedback = async () => {
    const feedbackId = userRepository.getUserFeedbackId();

    updateFeedbackMutation({
      variables: {
        input: {
          id: feedbackId,
          comment: 'This is a comment',
          email: 'test@email.com'
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
    createFeedback,
    updateFeedback,
    getFeedback
  };
};

export default useFeedback;
