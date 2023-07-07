/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import NewInput from '@/components/Common/Fields/updated/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import useTranslation from 'next-translate/useTranslation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { StyledPrejoinForm } from './styles';
import Button from '@/components/Common/Button';
import { User } from '@/types/user';

interface Props {
  isAuthenticated: boolean;
  user: User | null;
}

export const PrejoinForm = ({ isAuthenticated, user }: Props) => {
  const { t } = useTranslation('form');

  const schema = yup.object({
    name: yup
      .string()
      .matches(/[^-\s]/, {
        excludeEmptyString: true,
        message: t('validation.notEmpty')
      })
      .required(t('validation.required'))
  });

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: { name: user?.name ?? '' }
  });

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <StyledPrejoinForm onSubmit={handleSubmit(onSubmit)}>
      {!isAuthenticated && (
        <NewInput
          label={t('name')}
          isDirty={dirtyFields.name}
          hasError={errors.name}
          {...register('name')}
        />
      )}
      <Button variant="primary" size="large" type="submit">
        {t('worldCafe.prejoin.join')}
      </Button>
    </StyledPrejoinForm>
  );
};
