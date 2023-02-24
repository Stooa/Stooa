/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from '@/components/Common/Button';
import NewTextarea from '@/components/Common/Fields/updated/Textarea';
import useTranslation from 'next-translate/useTranslation';
import { useForm } from 'react-hook-form';
import { StyledCommentForm, StyledStepWrapper } from './styles';

interface Props {
  handleCommentFeedback: (comment: string) => void;
  handleSkip: () => void;
  title: 'feedback.commentWhatDidYouLike' | 'feedback.commentImproveTitle';
}

const StepComment = ({ handleCommentFeedback, handleSkip, title }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty }
  } = useForm({ defaultValues: { comment: '' } });

  const { t } = useTranslation('fishbowl');

  const onSubmit = data => {
    handleCommentFeedback(data.comment);
  };

  return (
    <StyledStepWrapper key="comment">
      <h4 className="medium body-sm">{t(title)}</h4>
      <StyledCommentForm onSubmit={handleSubmit(onSubmit)}>
        <NewTextarea
          isDirty={dirtyFields.comment}
          label={t('feedback.commentPlaceholder')}
          {...register('comment', { required: true, maxLength: 400 })}
        />
        {errors.comment && <span>This field is required</span>}

        <div className="actions">
          <Button type="button" variant="subtleLink" onClick={handleSkip}>
            {t('feedback.skip')}
          </Button>
          <Button disabled={!isDirty} type="submit" variant="text">
            {t('feedback.send')}
          </Button>
        </div>
      </StyledCommentForm>
    </StyledStepWrapper>
  );
};

export default StepComment;
