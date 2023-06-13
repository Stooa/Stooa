/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useRef, useState } from 'react';

import Button from '@/components/Common/Button';
import NewInput from '@/components/Common/Fields/updated/Input';
import NewTextarea from '@/components/Common/Fields/updated/Textarea';
import { SubmitHandler, set, useFieldArray, useForm } from 'react-hook-form';
import { StyledAddButton, StyledScrollWrapper, StyledStepper, StyledWorldCafeForm } from './styles';
import Select from '@/components/Common/Fields/updated/Select';
import Switch from '@/components/Common/Fields/updated/Switch';

type Question = {
  title: string;
  description: string;
};

interface FormValues {
  title: string;
  description: string;
  roundDuration: number;
  addExtraTime: boolean;
  questions: Question[];
}

const WorldCafeForm = () => {
  const [step, setStep] = useState<'basics' | 'questions'>('basics');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields, isDirty }
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      roundDuration: 10,
      addExtraTime: true,
      questions: [
        { title: 'Pregunta 1', description: '' },
        { title: 'Pregunta 2', description: '' }
      ]
    }
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'questions'
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleAddNewTopic = () => {
    append({ title: `Pregunta ${fields.length + 1}`, description: '' });
  };

  const handleScrollToSlide = event => {
    event.preventDefault();
    setStep('questions');
    wrapperRef.current && wrapperRef.current?.scrollTo({ left: 600, behavior: 'smooth' });
  };

  const returnToBeginning = event => {
    event.preventDefault();
    setStep('basics');
    wrapperRef.current && wrapperRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const onSubmit: SubmitHandler<FormValues> = data => console.log(data);

  return (
    <StyledWorldCafeForm onSubmit={handleSubmit(onSubmit)}>
      <h2>World cafe form</h2>

      <StyledStepper>
        <li className={step === 'basics' ? 'medium ' : ''}>Básicos</li>

        <li className={step === 'questions' ? 'medium ' : ''}>Preguntas</li>
      </StyledStepper>

      <button onClick={returnToBeginning}>return to beginning ---- </button>
      {'  '}
      <button onClick={handleScrollToSlide}>scroll to</button>

      <StyledScrollWrapper ref={wrapperRef}>
        <div id="step-general">
          <NewInput label="Title" />
          <NewTextarea label="Description" />

          <h3>Round duration</h3>

          <Select icon="clock" label="Cada ronda dura">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </Select>

          <Switch label="Añadir 5 minutos extra a la primera ronda" />

          <Button
            data-testid="feedback-comment-send-button"
            type="submit"
            color="primary"
            variant="text"
          >
            Siguiente
          </Button>
        </div>

        {/* QUESTIONS */}
        <div id="step-questions">
          <h3>Questions</h3>
          {fields.map((field, index) => (
            <div key={field.id}>
              <NewInput {...register(`questions.${index}.title`)} />
              <NewTextarea {...register(`questions.${index}.description`)} />
            </div>
          ))}
          <StyledAddButton onClick={handleAddNewTopic}>+ Add topic</StyledAddButton>
        </div>
      </StyledScrollWrapper>
    </StyledWorldCafeForm>
  );
};

export default WorldCafeForm;
