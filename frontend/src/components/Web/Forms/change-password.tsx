/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
  useMutation
} from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import { withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { ROUTE_HOME } from '@/app.config';
import { RESET_LOGGED_PASSWORD } from '@/lib/gql/Password';
import StandardForm from '@/ui/Form';
import Input from '@/components/Common/Fields/Input';
import SubmitBtn from '@/components/Web/SubmitBtn';
import FormError from '@/components/Web/Forms/FormError';

interface FormValues {
  password: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

interface FormProps {
  required: string;
  equalPassword: string;
  minlength: string;
  onSubmit: (any) => void;
  changePassword: (
    options?: MutationFunctionOptions<unknown, OperationVariables>
  ) => Promise<FetchResult<unknown, Record<string, unknown>, Record<string, unknown>>>;
}

const initialValues = {
  password: '',
  newPassword: '',
  newPasswordConfirmation: ''
};

const Form = (props: FormikProps<FormValues>) => {
  const { t } = useTranslation('form');

  return (
    <StandardForm>
      <fieldset>
        <Input
          label={t('password')}
          name="password"
          type="password"
          autoComplete="off"
          icon="lock"
        />
      </fieldset>
      <fieldset>
        <Input label={t('password:newPassword')} name="newPassword" type="password" />
        <Input
          label={t('password:passwordConfirmation')}
          name="newPasswordConfirmation"
          type="password"
        />
      </fieldset>
      <fieldset>
        <SubmitBtn text={t('button.changePassword')} disabled={props.isSubmitting} />
      </fieldset>
    </StandardForm>
  );
};

const FormValidation = withFormik<FormProps, FormValues>({
  mapPropsToValues: () => initialValues,
  validationSchema: props => {
    return Yup.object({
      password: Yup.string().required(props.required),
      newPassword: Yup.string().min(6, props.minlength).required(props.required),
      newPasswordConfirmation: Yup.string()
        .required(props.required)
        .oneOf([Yup.ref('newPassword'), null], props.equalPassword)
    });
  },
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    const { password, newPassword, newPasswordConfirmation } = values;

    await props
      .changePassword({
        variables: {
          input: {
            password,
            newPassword,
            newPasswordConfirmation
          }
        }
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
          data: error
        });
      });
  }
})(Form);

const RecoverPassword = () => {
  const router = useRouter();
  const [changePassword] = useMutation(RESET_LOGGED_PASSWORD);
  const [error, setError] = useState(null);
  const { t, lang } = useTranslation('form');

  const handleOnSubmit = async res => {
    if (res.type === 'Error') {
      setError(res.data);
      console.log('[STOOA] submit error', res);
    } else {
      router.push(ROUTE_HOME, ROUTE_HOME, { locale: lang });
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
        changePassword={changePassword}
        onSubmit={handleOnSubmit}
      />
    </>
  );
};

export default RecoverPassword;
