/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from '@/components/Common/Button';
import Input from '@/components/Common/Fields/Input';
import useTranslation from 'next-translate/useTranslation';
import { useForm } from 'react-hook-form';
import { StyledCommentForm, StyledStepWrapper } from './styles';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Trans from 'next-translate/Trans';

interface Props {
  handleMailFeedback: (email: string) => void;
  handleSkip: () => void;
}

const StepMail = ({ handleMailFeedback, handleSkip }: Props) => {
  const { t } = useTranslation('fishbowl');

  const schema = yup.object({
    email: yup.string().email(t('form:validation.email'))
  });

  const {
    register,
    handleSubmit,
    formState: { dirtyFields, isDirty, errors, isSubmitted }
  } = useForm({ resolver: yupResolver(schema), defaultValues: { email: '' } });

  const onSubmit = data => {
    handleMailFeedback(data.email);
  };

  return (
    <StyledStepWrapper data-testid="feedback-mail-step" key="mail">
      <h4 className="medium body-sm">{t('feedback.emailTitle')}</h4>
      <p className="body-sm description">
        <Trans i18nKey="fishbowl:feedback.emailDescription" components={{ i: <i /> }} />
      </p>
      <StyledCommentForm onSubmit={handleSubmit(onSubmit)}>
        <Input
          isSubmitted={isSubmitted}
          data-testid="feedback-mail-input"
          hasError={errors.email}
          icon="mail"
          isDirty={dirtyFields.email}
          label={t('feedback.emailPlaceholder')}
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
        />

        <div className="actions">
          <Button data-testid="skip-mail" type="button" variant="subtleLink" onClick={handleSkip}>
            {t('feedback.skip')}
          </Button>
          <Button
            data-testid="feedback-mail-send-button"
            disabled={!isDirty}
            type="submit"
            variant="text"
          >
            {t('feedback.send')}
          </Button>
        </div>
      </StyledCommentForm>
    </StyledStepWrapper>
  );
};

export default StepMail;
