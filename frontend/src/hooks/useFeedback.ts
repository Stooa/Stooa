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
import { getAuthToken } from '@/user/auth';
import api from '@/lib/api';
import { Feedback } from '@/types/api-platform/interfaces/feedback';
import { Fishbowl } from '@/types/api-platform';

const useFeedback = (fishbowlData: Fishbowl) => {
  const [createFeedbackMutation] = useMutation(CREATE_FEEDBACK);
  const [updateFeedbackMutation] = useMutation(UPDATE_FEEDBACK);

  const createFeedback = (
    satisfaction: 'sad' | 'neutral' | 'happy',
    origin: 'fishbowl' | 'thank-you'
  ) => {
    console.log('---> data fishbowl', fishbowlData);
    const participant = userRepository.getUserParticipantId();
    const fishbowl = fishbowlData.id;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
          userRepository.setUserFeedback({
            feedbackId: feedback.id,
            feedbackFishbowlSlug: fishbowlData.slug
          });
        }

        console.log('[STOOA] Create Feedback', res);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getFeedback = async (): Promise<Feedback | null> => {
    const auth = await getAuthToken();
    const { feedbackId } = userRepository.getUserFeedback();

    return api
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
        return null;
      });
  };

  const updateFeedback = async ({ type, data }: { type: 'email' | 'comment'; data: string }) => {
    const { feedbackId } = userRepository.getUserFeedback();

    updateFeedbackMutation({
      variables: {
        input: {
          id: feedbackId,
          ...(type === 'comment' && { comment: data }),
          ...(type === 'email' && { email: data })
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
