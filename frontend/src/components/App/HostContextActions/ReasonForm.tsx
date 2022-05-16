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
import { kickParticipant } from '@/lib/jitsi';
import { User } from '@/types/user';
import React from 'react';

interface Props {
  participant: User;
}

interface FormValues {
  reason: string;
  participant: User;
}

interface FormProps {
  reason: string;
  participant: User;
}

const initialValues = {
  reason: '',
  participant: null
};

const Form = (props: FormikProps<FormValues>) => {
  const { t } = useTranslation('fishbowl');

  return (
    <FormikForm>
      <label>
        <input type="radio" name="reason" value={REASON_NO_PARTICIPATING} />
        {t('kick.modal.options.noParticipating')}
      </label>
      <label>
        <input type="radio" name="reason" value={REASON_CONDUCT_VIOLATION} />
        {t('kick.modal.options.conductViolation')}
      </label>
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
  handleSubmit: (values, { props, setSubmitting }) => {
    if (props.participant && values.reason) {
      console.log('REASON---->', values.reason);
      // kickParticipant(props.participant.id, values.reason);
    }
  }
})(Form);

const ReasonForm: React.FC<Props> = ({ participant, children }) => {
  return (
    <>
      <FormValidation reason={REASON_NO_PARTICIPATING} participant={participant} />
    </>
  );
};

export default ReasonForm;
