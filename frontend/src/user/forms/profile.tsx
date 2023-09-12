/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import * as Yup from 'yup';

import { ROUTE_HOME } from '@/app.config';
import { useAuth } from '@/contexts/AuthContext';
import StandardForm from '@/ui/Form';
import { getAuthToken } from '@/user/auth';
import { UPDATE_USER } from '@/lib/gql/User';

import SubmitBtn from '@/components/Web/SubmitBtn';
import FormError from '@/components/Web/Forms/FormError';
import { linkedinValidator, twitterValidator } from '@/lib/Validators/SocialNetworkValidators';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Input from '@/components/Common/Fields/Input';

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  linkedin: string;
  twitter: string;
}

const mapUserDataToForm = userData => {
  const { email, linkedinProfile, name, surnames, twitterProfile } = userData;

  return {
    firstname: name,
    lastname: surnames,
    email: email,
    linkedin: linkedinProfile,
    twitter: twitterProfile
  };
};

const Profile = ({ userData, refetch }) => {
  const { t, lang } = useTranslation('form');
  const router = useRouter();
  const [backendErrors, setBackendErrors] = useState();
  const [updateUser] = useMutation(UPDATE_USER);
  const { user, updateUser: contextUpdateUser } = useAuth();

  const requiredError = t('validation.required');
  const urlError = t('validation.url');

  const schema = Yup.object({
    firstname: Yup.string().required(requiredError),
    lastname: Yup.string().required(requiredError),
    email: Yup.string().email(t('validation.email')).required(requiredError),
    linkedin: Yup.string()
      .matches(linkedinValidator, {
        message: urlError
      })
      .url(urlError),
    twitter: Yup.string()
      .matches(twitterValidator, {
        message: urlError
      })
      .url(urlError)
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields, errors, isSubmitting, isSubmitted }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      firstname: '',
      lastname: '',
      linkedin: '',
      twitter: ''
    }
  });

  const onCompletedSubmit = async res => {
    if (res.type === 'Error') {
      setBackendErrors(res.data);
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

  const onSubmit = async (values: FormValues) => {
    await updateUser({
      variables: {
        input: {
          name: values.firstname,
          surnames: values.lastname,
          linkedinProfile: values.linkedin,
          twitterProfile: values.twitter,
          id: userData.id
        }
      }
    })
      .then(async res => {
        await getAuthToken(true);

        reset(values, { keepDirtyValues: true });
        onCompletedSubmit(res);
      })
      .catch(error => {
        onCompletedSubmit({
          type: 'Error',
          data: error
        });
      });
  };

  useEffect(() => {
    if (userData) {
      reset(mapUserDataToForm(userData), {
        keepDefaultValues: true
      });
    }
  }, [userData, reset]);

  return (
    <>
      {backendErrors && <FormError errors={backendErrors} />}
      <StandardForm onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset-inline">
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.firstname}
            hasError={errors.firstname}
            label={t('firstname')}
            type="text"
            variant="small"
            {...register('firstname')}
          />
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.lastname}
            hasError={errors.lastname}
            label={t('lastname')}
            type="text"
            variant="small"
            {...register('lastname')}
          />
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.email}
            hasError={errors.email}
            label={t('email')}
            type="email"
            icon="mail"
            disabled
            {...register('email')}
          />
        </fieldset>
        <fieldset>
          <p className="body-xs">
            <Trans i18nKey="register:shareAccount" components={{ strong: <strong /> }} />
          </p>
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.twitter}
            hasError={errors.twitter}
            label={t('register:twitter')}
            type="text"
            help={t('register:twitterHelp')}
            {...register('twitter')}
          />
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.linkedin}
            hasError={errors.linkedin}
            label={t('register:linkedin')}
            type="text"
            help={t('register:linkedinHelp')}
            {...register('linkedin')}
          />
        </fieldset>
        <fieldset>
          <SubmitBtn text={t('button.save')} disabled={isSubmitting} />
        </fieldset>
      </StandardForm>
    </>
  );
};

export default Profile;
