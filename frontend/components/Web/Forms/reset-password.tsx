/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import { withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';

import Input from 'components/Common/Fields/Input';
import { RESET_PASSWORD } from 'lib/gql/Password';
import { useAuth } from 'contexts/AuthContext';
import FormikForm from 'ui/Form';
import SubmitBtn from 'components/Web/SubmitBtn';
import FormError from 'components/Web/Forms/FormError';

interface IFormValues {
  password: string;
  passwordConfirmation: string;
}

interface IFormProps {
  required: string;
  equalPassword: string;
  minlength: string;
  onSubmit: any;
  resetPassword: any;
  token: any;
}

const initialValues = {
  password: '',
  passwordConfirmation: '',
};

const Form = (props: FormikProps<IFormValues>) => {
  const { t } = useTranslation('password');

  return (
    <FormikForm>
      <fieldset>
        <Input label={t('newPassword')} name="password" type="password" icon="lock" />
        <Input
          label={t('passwordConfirmation')}
          name="passwordConfirmation"
          type="password"
          icon="lock"
        />
      </fieldset>
      <fieldset>
        <SubmitBtn text={t('changePassword')} disabled={props.isSubmitting} />
      </fieldset>
    </FormikForm>
  );
};

const FormValidation = withFormik<IFormProps, IFormValues>({
  mapPropsToValues: () => initialValues,
  validationSchema: props => {
    return Yup.object({
      password: Yup.string().min(6, props.minlength).required(props.required),
      passwordConfirmation: Yup.string()
        .required(props.required)
        .oneOf([Yup.ref('password'), null], props.equalPassword),
    });
  },
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    await props
      .resetPassword({
        variables: {
          input: {
            token: props.token.token,
            password: values.password,
            passwordConfirmation: values.passwordConfirmation,
          },
        },
      })
      .then(res => {
        setSubmitting(false);
        resetForm({ values: initialValues });
        props.onSubmit(res, values);
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

const ResetPassword = token => {
  const [resetPassword] = useMutation(RESET_PASSWORD);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const { t } = useTranslation('form');

  const handleOnSubmit = async (res, values) => {
    if (res.type === 'Error') {
      setError(res.data);
      console.log('[STOOA] submit error', res);
    } else {
      console.log('[STOOA] password changed', res);
      const {
        data: {
          changePasswordUser: {
            user: { email },
          },
        },
      } = res;

      await login(email, values.password).then(res => {
        if (res.type === 'Error') {
          setError(error);
          console.error('[STOOA LOGIN]', error.message);
        }
      });
    }
  };

  const requiredError = t('validation.required');
  const equalPasswordError = t('validation.equalPassword');
  const minlengthError = t('validation.passwordLength');

  return (
    <>
      {error && <FormError errors={error} />}
      <FormValidation
        required={requiredError}
        equalPassword={equalPasswordError}
        minlength={minlengthError}
        resetPassword={resetPassword}
        onSubmit={handleOnSubmit}
        token={token}
      />
    </>
  );
};

export default ResetPassword;
