/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from '@/components/Common/Button';
import NewInput from '@/components/Common/Fields/updated/Input';
import useTranslation from 'next-translate/useTranslation';
import { useForm } from 'react-hook-form';
import { StyledCommentForm, StyledStepWrapper } from './styles';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface Props {
  handleMailFeedback: (email: string) => void;
}

const StepMail = ({ handleMailFeedback }: Props) => {
  const { t } = useTranslation('fishbowl');

  const emailError = t('form:validation.email');

  const schema = Yup.object({
    email: Yup.string().email(emailError)
  });

  const {
    register,
    handleSubmit,
    formState: { dirtyFields, errors }
  } = useForm({ resolver: yupResolver(schema), defaultValues: { email: '' } });

  const onSubmit = data => {
    handleMailFeedback(data.email);
  };

  return (
    <StyledStepWrapper>
      <h4 className="medium body-sm">{t('feedback.emailTitle')}</h4>
      <p className="body-sm description">{t('feedback.emailDescription')}</p>
      <StyledCommentForm onSubmit={handleSubmit(onSubmit)}>
        <NewInput
          hasError={errors.email}
          errorMessage={'wrong email format'}
          icon="mail"
          isDirty={dirtyFields.email}
          label={t('feedback.emailPlaceholder')}
          {...register('email', { pattern: /^\S+@\S+$/i })}
        />

        <div className="actions">
          <Button type="button" variant="subtleLink">
            {t('feedback.skip')}
          </Button>
          <Button type="submit" variant="text">
            {t('feedback.send')}
          </Button>
        </div>
      </StyledCommentForm>
    </StyledStepWrapper>
  );
};

export default StepMail;
