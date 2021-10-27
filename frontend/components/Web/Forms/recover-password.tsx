/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import { withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { ROUTE_SIGN_IN } from 'app.config';
import { RECOVER_PASSWORD } from 'lib/gql/Password';
import FormikForm from 'ui/Form';
import Alert from 'ui/Alert';
import Input from 'components/Common/Fields/Input';
import SubmitBtn from 'components/Web/SubmitBtn';
import FormError from 'components/Web/Forms/FormError';

interface IFormValues {
  email: string;
}

interface IFormProps {
  required: string;
  email: string;
  onSubmit: any;
  recoverPassword: any;
  locale: string;
}

const initialValues = {
  email: '',
};

const Form = (props: FormikProps<IFormValues>) => {
  const { t } = useTranslation('form');

  return (
    <FormikForm>
      <fieldset>
        <Input label={t('email')} name="email" type="email" icon="mail" />
      </fieldset>
      <fieldset>
        <SubmitBtn text={t('recover:button')} disabled={props.isSubmitting} />
      </fieldset>
      <fieldset className="form__footer">
        <p className="text-sm">
          <Link href={ROUTE_SIGN_IN}>
            <a>{t('recover:back')}</a>
          </Link>
        </p>
      </fieldset>
    </FormikForm>
  );
};

const FormValidation = withFormik<IFormProps, IFormValues>({
  mapPropsToValues: () => initialValues,
  validationSchema: props => {
    return Yup.object({
      email: Yup.string().email(props.email).required(props.required),
    });
  },
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    await props
      .recoverPassword({
        variables: {
          input: {
            email: values.email,
            locale: props.locale,
          },
        },
      })
      .then(res => {
        setSubmitting(false);
        resetForm({ values: initialValues });
        props.onSubmit(res);
      })
      .catch(error => {
        setSubmitting(false);
        props.onSubmit({
          type: 'Error',
          data: error,
        });
      });
  },
})(Form);

const RecoverPassword = () => {
  const [recoverPassword] = useMutation(RECOVER_PASSWORD);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const { t, lang } = useTranslation('form');

  const handleOnSubmit = async res => {
    if (res.type === 'Error') {
      setError(res.data);

      console.log('[STOOA] submit error', res);
    } else {
      setSubmitted(true);
    }
  };

  const requiredError = t('validation.required');
  const emailError = t('validation.email');

  return submitted ? (
    <Alert className="success lg">{t('recover:sent')}</Alert>
  ) : (
    <>
      {error && <FormError errors={error} />}
      <FormValidation
        required={requiredError}
        email={emailError}
        recoverPassword={recoverPassword}
        onSubmit={handleOnSubmit}
        locale={lang}
      />
    </>
  );
};

export default RecoverPassword;
