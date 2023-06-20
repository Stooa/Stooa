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
import Trans from 'next-translate/Trans';
import { withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { ROUTE_HOME } from '@/app.config';
import { useAuth } from '@/contexts/AuthContext';
import FormikForm from '@/ui/Form';
import { getAuthToken } from '@/user/auth';
import { UPDATE_USER } from '@/lib/gql/User';
import Input from '@/components/Common/Fields/Input';
import SubmitBtn from '@/components/Web/SubmitBtn';
import FormError from '@/components/Web/Forms/FormError';
import { linkedinValidator, twitterValidator } from '@/lib/Validators/SocialNetworkValidators';

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  linkedin: string;
  twitter: string;
  isSubmitting: boolean;
}

interface FormProps {
  required: string;
  email: string;
  minlength: string;
  url: string;
  onSubmit: (any) => Promise<void>;
  initialValues: {
    id: string;
    linkedinProfile: string;
    name: string;
    surnames: string;
    twitterProfile: string;
  } & FormValues;
  updateUser: (
    options?: MutationFunctionOptions<unknown, OperationVariables>
  ) => Promise<FetchResult<unknown, Record<string, unknown>, Record<string, unknown>>>;
}

const Form = (props: FormikProps<FormValues>) => {
  const { t } = useTranslation('form');

  return (
    <FormikForm>
      <fieldset className="fieldset-inline">
        <Input label={t('firstname')} name="firstname" type="text" variant="small" />
        <Input label={t('lastname')} name="lastname" type="text" variant="small" />
        <Input
          className="disabled"
          label={t('email')}
          name="email"
          type="email"
          icon="mail"
          disabled
        />
      </fieldset>
      <fieldset>
        <p className="body-xs">
          <Trans i18nKey="register:shareAccount" components={{ strong: <strong /> }} />
        </p>
        <Input
          label={t('register:twitter')}
          name="twitter"
          type="text"
          help={t('register:twitterHelp')}
        />
        <Input
          label={t('register:linkedin')}
          name="linkedin"
          type="text"
          help={t('register:linkedinHelp')}
        />
      </fieldset>
      <fieldset>
        <SubmitBtn text={t('button.save')} disabled={props.isSubmitting} />
      </fieldset>
    </FormikForm>
  );
};

const FormValidation = withFormik<FormProps, FormValues>({
  mapPropsToValues: props => {
    const {
      initialValues: { email, linkedinProfile, name, surnames, twitterProfile }
    } = props;

    return {
      firstname: name,
      lastname: surnames,
      email,
      linkedin: linkedinProfile,
      twitter: twitterProfile,
      isSubmitting: false
    };
  },
  validationSchema: props => {
    return Yup.object({
      firstname: Yup.string().required(props.required),
      lastname: Yup.string().required(props.required),
      email: Yup.string().email(props.email).required(props.required),
      linkedin: Yup.string()
        .matches(linkedinValidator, {
          message: props.url
        })
        .url(props.url),
      twitter: Yup.string()
        .matches(twitterValidator, {
          message: props.url
        })
        .url(props.url)
    });
  },
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    const {
      initialValues: { id }
    } = props;

    // TODO: make the values same name as initial props
    await props
      .updateUser({
        variables: {
          input: {
            id,
            name: values.firstname,
            surnames: values.lastname,
            linkedinProfile: values.linkedin,
            twitterProfile: values.twitter
          }
        }
      })
      .then(async res => {
        await getAuthToken(true);

        resetForm({ values });
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

const Profile = ({ userData, refetch }) => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [updateUser] = useMutation(UPDATE_USER);
  const { user, updateUser: contextUpdateUser } = useAuth();
  const { t, lang } = useTranslation('form');

  const requiredError = t('validation.required');
  const emailError = t('validation.email');
  const minlengthError = t('validation.passwordLength');
  const urlError = t('validation.url');

  const handleOnSubmit = async res => {
    if (res.type === 'Error') {
      setError(res.data);
      console.log('[STOOA] submit error', res);
    } else {
      const {
        data: {
          updateUser: { user: dataUser }
        }
      } = res;

      contextUpdateUser({
        ...user,
        name: `${dataUser.name} ${dataUser.surnames}`
      });

      refetch();
      router.push(ROUTE_HOME, ROUTE_HOME, { locale: lang });
    }
  };

  return (
    <div>
      {error && <FormError errors={error} />}
      <FormValidation
        required={requiredError}
        email={emailError}
        minlength={minlengthError}
        url={urlError}
        initialValues={userData}
        onSubmit={handleOnSubmit}
        updateUser={updateUser}
      />
    </div>
  );
};

export default Profile;
