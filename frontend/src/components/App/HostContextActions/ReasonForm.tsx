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

import FormikForm from '@/ui/Form';
import { REASON_CONDUCT_VIOLATION, REASON_NO_PARTICIPATING } from '@/lib/Reasons';
import Input from '@/components/Common/Fields/Input';
import { User } from '@/types/user';
import React from 'react';
import { kickParticipant } from '@/lib/jitsi';

interface ReasonFormProps {
  participant: User;
}

interface FormValues {
  reason: string;
}

interface FormProps {
  participant: User;
}

const initialValues = {
  reason: REASON_NO_PARTICIPATING
};

const Form = (props: FormikProps<FormValues>) => {
  const { t } = useTranslation('fishbowl');

  return (
    <FormikForm>
      <Input
        type="radio"
        name="reason"
        value={REASON_NO_PARTICIPATING}
        label={t('kick.modal.options.noParticipating')}
      />
      <Input
        type="radio"
        name="reason"
        value={REASON_CONDUCT_VIOLATION}
        label={t('kick.modal.options.conductViolation')}
      />
      <div className="modal-footer">
        <Button type="submit">{t('kick.modal.button')}</Button>
      </div>
    </FormikForm>
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
      kickParticipant(props.participant.id, values.reason);
    }
  }
})(Form);

const ReasonForm: React.FC<ReasonFormProps> = ({ participant }) => {
  return (
    <>
      <FormValidation participant={participant} />
    </>
  );
};

export default ReasonForm;
