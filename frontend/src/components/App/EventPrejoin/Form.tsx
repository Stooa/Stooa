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
import * as Yup from 'yup';

import { useStateValue } from '@/contexts/AppContext';
import { CREATE_GUEST } from '@/lib/gql/Fishbowl';
import StandardForm from '@/ui/Form';
import Button from '@/components/Common/Button';
import { useStooa } from '@/contexts/StooaManager';
import { connectWithPassword } from './connection';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useUser } from '@/jitsi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '@/components/Common/Fields/Input';

interface FormValues {
  name: string;
  isPrivate: boolean;
  password?: string;
}

const FormGuest = ({ isPrivate }: { isPrivate: boolean }) => {
  const { setFishbowlPassword, isModerator } = useStooa();
  const { getUserNickname, setUser } = useUser();
  const [, dispatch] = useStateValue();
  const [createGuest] = useMutation(CREATE_GUEST);
  const { t } = useTranslation('form');

  const { fid } = useRouter().query;

  const requiredError = t('validation.required');
  const notEmptyError = t('validation.notEmpty');

  useEffect(() => {
    setUser({
      guestId: ''
    });
  }, []);

  const schema = Yup.object({
    name: Yup.string()
      .matches(/[^-\s]/, {
        excludeEmptyString: true,
        message: notEmptyError
      })
      .required(requiredError),
    password: isPrivate ? Yup.string().required(requiredError) : Yup.string()
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { dirtyFields, errors, isSubmitting, isSubmitted }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { password: '', isPrivate, name: '' }
  });

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

        setUser({
          guestId: id.replace('/guests/', '')
        });

        console.log('[STOOA] CreateGuest response', res);
      })
      .catch(error => {
        console.log(error);
      });

    setUser({
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
            setError('password', { message: t('validation.wrongPassword') });
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

  useEffect(() => {
    setValue('name', getUserNickname(), { shouldDirty: true });
  }, []);

  return (
    <StandardForm onSubmit={handleSubmit(handleOnSubmit)} className="prejoin">
      <fieldset className="submit-wrapper">
        <Input
          isSubmitted={isSubmitted}
          hasError={errors.name}
          label={t('name')}
          type="text"
          isDirty={dirtyFields.name}
          {...register('name')}
        />
        {isPrivate && (
          <Input
            isSubmitted={isSubmitted}
            label={t('password')}
            type="password"
            autoComplete="false"
            isDirty={dirtyFields.password}
            hasError={errors.password}
            {...register('password')}
          />
        )}

        <Button size="large" type="submit" disabled={isSubmitting}>
          {t('fishbowl:prejoin.joinDiscussion')}
        </Button>
      </fieldset>
    </StandardForm>
  );
};

export default FormGuest;
