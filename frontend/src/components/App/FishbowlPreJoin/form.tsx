/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect } from 'react';

import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import { withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { useStateValue } from '@/contexts/AppContext';
import { CREATE_GUEST } from '@/lib/gql/Fishbowl';
import userRepository from '@/jitsi/User';
import FormikForm from '@/ui/Form';
import Input from '@/components/Common/Fields/Input';
import Button from '@/components/Common/Button';
import { useStooa } from '@/contexts/StooaManager';
import { connectWithPassword } from './connection';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

interface FormValues {
  name: string;
  isPrivate: boolean;
}

interface FormProps {
  notEmpty: string;
  required: string;
  onSubmit: (values: FormValues) => void;
  isPrivate: boolean;
}

const initialValues = {
  name: userRepository.getUserNickname(),
  isPrivate: false,
  password: ''
};

const Form = (props: FormProps & FormikProps<FormValues>) => {
  const { t } = useTranslation('form');

  useEffect(() => {
    userRepository.setUser({
      guestId: ''
    });
  }, []);

  return (
    <FormikForm className="prejoin">
      <fieldset className="submit-wrapper">
        <Input label={t('name')} name="name" type="text" />
        {props.isPrivate && <Input label={t('password')} name="password" type="password" />}

        <Button size="large" type="submit" disabled={props.isSubmitting}>
          {t('button.enterFishbowl')}
        </Button>
      </fieldset>
    </FormikForm>
  );
};

const FormValidation = withFormik<FormProps, FormValues>({
  mapPropsToValues: () => initialValues,
  validationSchema: props => {
    return Yup.object({
      name: Yup.string()
        .matches(/[^-\s]/, {
          excludeEmptyString: true,
          message: props.notEmpty
        })
        .required(props.required),
      password: props.isPrivate ? Yup.string().required(props.required) : Yup.string()
    });
  },
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    setSubmitting(false);
    resetForm({ values: initialValues });
    props.onSubmit(values);
  }
})(Form);

const Nickname = ({ isPrivate }: { isPrivate: boolean }) => {
  const { setFishbowlPassword, isModerator } = useStooa();
  const [, dispatch] = useStateValue();
  const [createGuest] = useMutation(CREATE_GUEST);
  const { t } = useTranslation('form');

  const { fid } = useRouter().query;

  const requiredError = t('validation.required');
  const notEmptyError = t('validation.notEmpty');

  const handleDispatchJoinGuest = (): void => {
    dispatch({
      type: 'JOIN_GUEST',
      isGuest: true,
      prejoin: false
    });
  };

  const handleOnSubmit = async values => {
    const { name = '' } = values;

    createGuest({
      variables: {
        input: {
          name
        }
      }
    })
      .then(res => {
        const {
          data: {
            createGuest: {
              guest: { id }
            }
          }
        } = res;

        userRepository.setUser({
          guestId: id.replace('/guests/', '')
        });

        console.log('[STOOA] CreateGuest response', res);
      })
      .catch(error => {
        console.log(error);
      });

    userRepository.setUser({
      nickname: name
    });

    if (isPrivate && values.password && !isModerator) {
      setFishbowlPassword(values.password);

      connectWithPassword(values.password, fid as string)
        .then(res => {
          console.log('[STOOA] ConnectWithPassword response', res);
          if (res.data.response) {
            handleDispatchJoinGuest();
          } else {
            toast(t('validation.wrongPassword'), {
              icon: '🔒',
              toastId: 'wrongPassword',
              type: 'error',
              position: 'bottom-center',
              autoClose: 5000
            });
          }
        })
        .catch(error => {
          console.log(error);
          toast(t('validation.unknownErrorServer'), {
            icon: '⚠️',
            toastId: 'unknownErrorServer',
            type: 'error',
            position: 'bottom-center',
            autoClose: 5000
          });
        });
    } else {
      handleDispatchJoinGuest();
    }
  };

  return (
    <FormValidation
      isPrivate={isPrivate}
      notEmpty={notEmptyError}
      required={requiredError}
      onSubmit={handleOnSubmit}
    />
  );
};

export default Nickname;
