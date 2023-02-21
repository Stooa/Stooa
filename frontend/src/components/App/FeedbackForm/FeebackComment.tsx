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
import { useForm } from 'react-hook-form';
import { StyledCommentForm, StyledStepWrapper } from './styles';

interface Props {
  handleCommentFeedback: (comment: string) => void;
}

const FeedbackComment = ({ handleCommentFeedback }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = data => handleCommentFeedback(data.comment);

  return (
    <StyledStepWrapper>
      <h4 className="medium body-sm">What can we improve?</h4>
      <StyledCommentForm onSubmit={handleSubmit(onSubmit)}>
        <NewTextarea label="Cuentanos más " {...(register('comment'), { required: true })} />
        {errors.comment && <span>This field is required</span>}

        <div className="actions">
          <Button type="button" variant="subtleLink">
            Skip
          </Button>
          <Button type="submit" as="input" variant="text">
            Enviar
          </Button>
        </div>
      </StyledCommentForm>
    </StyledStepWrapper>
  );
};

export default FeedbackComment;
