/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';
import * as Yup from 'yup';

import { REASON_CONDUCT_VIOLATION, REASON_NO_PARTICIPATING } from '@/lib/Reasons';
import Check from '@/ui/svg/checkmark.svg';
import React from 'react';
import { kickParticipant } from '@/lib/jitsi';
import { Participant } from '@/types/participant';
import { StyledReasonGroup } from './styles';
import MeditatingFriend from '@/components/Common/SVG/MeditatingFriend';

import { Formik, Form, Field } from 'formik';
import ReadingFriend from '@/components/Common/SVG/ReadingFriend';
import Button from '@/components/Common/Button';
import { toast } from 'react-toastify';
import Trans from 'next-translate/Trans';

interface FormProps {
  participant: Participant;
  onSubmit: () => void;
}

const initialValues = {
  reason: REASON_NO_PARTICIPATING
};

const KickReasonForm = ({ participant, onSubmit }: FormProps) => {
  const { t } = useTranslation('fishbowl');

  return (
    <>
      <Formik
        validationSchema={Yup.object({
          reason: Yup.string().required('Required message')
        })}
        initialValues={initialValues}
        onSubmit={async values => {
          if (participant && values.reason) {
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
                  <MeditatingFriend />
                  {t('kick.modal.options.noParticipating')}
                </div>
              </label>
              <label>
                <Field type="radio" name="reason" value={REASON_CONDUCT_VIOLATION} />
                <div
                  className={`reason-card ${
                    values.reason === REASON_CONDUCT_VIOLATION ? 'selected' : ''
                  }`}
                >
                  <ReadingFriend />
                  {t('kick.modal.options.conductViolation')}
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
