/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';
import { withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';
import Button from '@/components/Common/Button';

import { REASON_CONDUCT_VIOLATION, REASON_NO_PARTICIPATING } from '@/lib/Reasons';
import Input from '@/components/Common/Fields/Input';
import React from 'react';
import { kickParticipant } from '@/lib/jitsi';
import { Participant } from '@/types/participant';
import { KickReasonFormStyled } from './styles';

interface KickReasonFormProps {
  participant: Participant;
  onSubmit: () => void;
}

interface FormProps {
  participant: Participant;
  onSubmit: () => void;
}

interface FormValues {
  reason: string;
}

const initialValues = {
  reason: REASON_NO_PARTICIPATING
};

const Form = () => {
  const { t } = useTranslation('fishbowl');

  return (
    <KickReasonFormStyled>
      <Input
        validation={false}
        type="radio"
        name="reason"
        value={REASON_NO_PARTICIPATING}
        label={t('kick.modal.options.noParticipating')}
      >
        <div>Cositas</div>
      </Input>
      <Input
        validation={false}
        type="radio"
        name="reason"
        value={REASON_CONDUCT_VIOLATION}
        label={t('kick.modal.options.conductViolation')}
      />
      <div className="modal-footer">
        <Button type="submit">{t('kick.modal.button')}</Button>
      </div>
    </KickReasonFormStyled>
  );
};

const FormValidation = withFormik<FormProps, FormValues>({
  mapPropsToValues: () => initialValues,
  validationSchema: props =>
    Yup.object({
      reason: Yup.string().required(props.required)
    }),
  handleSubmit: (values, { props }) => {
    if (props.participant && values.reason) {
      kickParticipant(props.participant.getId(), values.reason);
      props.onSubmit();
    }
  }
})(Form);

const KickReasonForm: React.FC<KickReasonFormProps> = ({ participant, onSubmit }) => {
  return (
    <>
      <FormValidation participant={participant} onSubmit={onSubmit} />
    </>
  );
};

export default KickReasonForm;
