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
import { useEffect, useState } from 'react';
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
    watch,
    formState: { errors, dirtyFields, isDirty }
  } = useForm({ defaultValues: { comment: '' } });
  const [commentState, setCommentState] = useState<'' | 'warning' | 'error'>('');

  const { t } = useTranslation('fishbowl');

  const onSubmit = data => {
    handleCommentFeedback(data.comment);
  };

  const maxLength = 400;

  const commentLength = watch('comment').length || 0;

  useEffect(() => {
    const subscription = watch(value => {
      if (value && value.comment && value.comment.length >= maxLength) {
        setCommentState('error');
        return;
      } else if (value && value.comment && value.comment.length >= maxLength - 50) {
        setCommentState('warning');
        return;
      } else {
        setCommentState('');
        return;
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <StyledStepWrapper data-testid="feedback-comment-step" key="comment">
      <h4 className="medium body-sm">{t(title)}</h4>
      <StyledCommentForm onSubmit={handleSubmit(onSubmit)}>
        <NewTextarea
          hasError={errors.comment}
          counter={commentLength}
          lengthState={commentState}
          errorMessage={t('form:validation.maxLength', { length: maxLength.toString() })}
          data-testid="feedback-comment-textarea"
          isDirty={dirtyFields.comment}
          label={t('feedback.commentPlaceholder')}
          {...register('comment', { required: true, maxLength })}
        />
        <div className="actions">
          <Button
            type="button"
            variant="subtleLink"
            onClick={handleSkip}
            data-testid="skip-comment"
          >
            {t('feedback.skip')}
          </Button>
          <Button
            data-testid="feedback-comment-send-button"
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

export default StepComment;
