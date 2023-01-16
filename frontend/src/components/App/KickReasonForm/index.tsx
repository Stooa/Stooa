/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import * as Yup from 'yup';

import { REASON_CONDUCT_VIOLATION, REASON_NO_PARTICIPATING } from '@/lib/Reasons';
import Check from '@/ui/svg/checkmark.svg';
import React from 'react';
import { kickParticipant } from '@/lib/jitsi';
import { Participant } from '@/types/participant';
import { StyledReasonGroup } from './styles';
import { pushEventDataLayer } from '@/lib/analytics';
import { Formik, Form, Field } from 'formik';
import Button from '@/components/Common/Button';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

interface FormProps {
  participant: Participant;
  onSubmit: () => void;
}

const initialValues = {
  reason: REASON_NO_PARTICIPATING
};

const KickReasonForm = ({ participant, onSubmit }: FormProps) => {
  const { t } = useTranslation('fishbowl');
  const router = useRouter();
  const { fid } = router.query;

  return (
    <>
      <Formik
        validationSchema={Yup.object({
          reason: Yup.string().required('Required message')
        })}
        initialValues={initialValues}
        onSubmit={async values => {
          if (participant && values.reason) {
            pushEventDataLayer({
              action: fid as string,
              category: 'Kick',
              label: values.reason === REASON_CONDUCT_VIOLATION ? 'hard' : 'soft'
            });

            kickParticipant(participant.getId(), values.reason);
            toast(t('kick.successMessage'), {
              icon: <Check />,
              toastId: 'kick-success',
              type: 'success',
              position: 'bottom-center',
              autoClose: 5000
            });
          }
          onSubmit();
        }}
      >
        {({ values }) => (
          <Form>
            <StyledReasonGroup role="group" aria-labelledby="reasons-radio-group">
              <label>
                <Field type="radio" name="reason" value={REASON_NO_PARTICIPATING} />
                <div
                  className={`reason-card ${
                    values.reason === REASON_NO_PARTICIPATING ? 'selected' : ''
                  }`}
                >
                  <Image
                    className="friend-image"
                    src="/img/friends/meditating.png"
                    alt="Illustration of a friend meditating"
                    height={146.38}
                    width={151}
                    quality={100}
                  />
                  <p>{t('kick.modal.options.noParticipating')}</p>
                </div>
              </label>
              <label>
                <Field type="radio" name="reason" value={REASON_CONDUCT_VIOLATION} />
                <div
                  className={`reason-card ${
                    values.reason === REASON_CONDUCT_VIOLATION ? 'selected' : ''
                  }`}
                >
                  <Image
                    className="friend-image"
                    src="/img/friends/reading.png"
                    alt="Illustration of a friend reading"
                    height={146}
                    width={140.06}
                    quality={100}
                  />

                  <p>{t('kick.modal.options.conductViolation')}</p>
                </div>
              </label>
            </StyledReasonGroup>
            <fieldset>
              <Button size="large" type="submit">
                {t('kick.modal.button')}
              </Button>
            </fieldset>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default KickReasonForm;
