/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';

import { useStateValue } from '@/contexts/AppContext';

import Button from '@/components/Common/Button';
import StandardForm from '@/ui/Form';
import * as Yup from 'yup';
import { useStooa } from '@/contexts/StooaManager';
import { connectWithPassword } from './connection';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { NO_INTRO_RUN_FISHBOWL } from '@/graphql/Fishbowl';
import { IConferenceStatus } from '@/jitsi/Status';
import { useUser } from '@/jitsi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '@/components/Common/Fields/Input';

type Props = {
  name: string;
  isPrivate: boolean;
};

interface FormValues {
  password: string;
}

const AuthUser = ({ name, isPrivate }: Props) => {
  const { data, isModerator, setFishbowlPassword, conferenceStatus } = useStooa();
  const [, dispatch] = useStateValue();
  const { setUser } = useUser();
  const [runWithoutIntroFishbowl] = useMutation(NO_INTRO_RUN_FISHBOWL);
  const { t } = useTranslation('form');
  const { fid } = useRouter().query;

  const schema = Yup.object({
    password:
      isPrivate && !isModerator ? Yup.string().required(t('validation.required')) : Yup.string()
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { dirtyFields, errors, isSubmitted }
  } = useForm<FormValues>({ resolver: yupResolver(schema), defaultValues: { password: '' } });

  const startFishbowlNow = () => {
    try {
      const slug = { variables: { input: { slug: fid } } };

      runWithoutIntroFishbowl(slug)
        .then(() => {
          console.log('[STOOA] run fishbowl without introduction');
        })
        .catch(error => {
          console.error(error);
        });
    } catch (error) {
      console.error(`[STOOA] Error run fishbowl without introduction: ${error}`);
    }
  };

  const handleDispatchStartFishbowlNow = () => {
    dispatch({
      type: 'START_FISHBOWL_NOW',
      prejoin: false,
      fishbowlStarted: true
    });
  };

  const handleDispatchJoin = (): void => {
    dispatch({
      type: 'JOIN_USER',
      prejoin: false,
      isGuest: false
    });
  };

  const handleOnSubmit = values => {
    if (isPrivate && values.password && !isModerator) {
      setFishbowlPassword(values.password);

      connectWithPassword(values.password, fid as string)
        .then(res => {
          console.log('[STOOA] ConnectWithPassword response', res);
          if (res.data.response) {
            handleDispatchJoin();
          } else {
            setError('password', { message: t('validation.wrongPassword') });
          }
        })
        .catch(error => {
          console.log(error);
          toast(t('validation.unknownErrorServer'), {
            icon: '⚠️',
            type: 'error',
            position: 'bottom-center',
            autoClose: 5000
          });
        });
    } else if (data.isFishbowlNow && conferenceStatus === IConferenceStatus.NOT_STARTED) {
      handleDispatchStartFishbowlNow();
      startFishbowlNow();
    } else {
      handleDispatchJoin();
    }
  };

  const getButtonText = () => {
    if (isModerator && data.isFishbowlNow && conferenceStatus === IConferenceStatus.NOT_STARTED) {
      return t('fishbowl:prejoin.startFishbowl');
    } else {
      return t('fishbowl:prejoin.joinDiscussion');
    }
  };

  setUser({ guestId: '', nickname: name });

  return (
    <StandardForm onSubmit={handleSubmit(handleOnSubmit)}>
      <fieldset className="submit-wrapper">
        {isPrivate && !isModerator && (
          <Input
            isSubmitted={isSubmitted}
            data-testid="prejoin-password"
            hasError={errors.password}
            placeholder={t('fishbowl.passwordPlaceholder')}
            label={t('fishbowl.passwordInputLabel')}
            icon="lock"
            isDirty={dirtyFields.password}
            autoComplete="off"
            type="password"
            {...register('password')}
          />
        )}

        <Button
          type="submit"
          size="large"
          data-testid="prejoin-cta"
          disabled={isPrivate && !isModerator}
        >
          {getButtonText()}
        </Button>
      </fieldset>
    </StandardForm>
  );
};

export default AuthUser;
