/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';

import Button from '@/components/Common/Button';
import NewInput from '@/components/Common/Fields/updated/Input';
import NewTextarea from '@/components/Common/Fields/updated/Textarea';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { StyledAddButton, StyledDeleteButton, StyledStepper, StyledWorldCafeForm } from './styles';
import Select from '@/components/Common/Fields/updated/Select';
import Switch from '@/components/Common/Fields/updated/Switch';
import TitleWithDivider from '@/components/Common/TitleWithDivider/TitleWithDivider';
import { TimeZoneSelector } from '@/components/Common/TimezoneSelector/TimeZoneSelector';
import DatePicker from '@/components/Common/Fields/updated/DatePicker';

type Question = {
  title: string;
  description: string;
};

interface FormValues {
  title: string;
  description: string;
  timezone: string;
  date: Date;
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
    formState: { errors, dirtyFields }
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      date: new Date(),
      roundDuration: 10,
      addExtraTime: true,
      questions: [
        { title: '', description: '' },
        { title: '', description: '' }
      ]
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });

  const handleAddNewTopic = () => {
    append({ title: `Pregunta ${fields.length + 1}`, description: '' });
  };

  const handleDeleteTopic = (index: number) => {
    remove(index);
  };

  const handleNextStep = event => {
    event.preventDefault();
    setStep('questions');
  };

  const returnToBeginning = event => {
    event.preventDefault();
    setStep('basics');
  };

  const handleShowDescription = event => {
    const elementClicked = event.target;
    const description =
      elementClicked.parentElement.parentElement.querySelector('textarea.description');

    console.log(description);
    description.classList.add('show');
  };

  const onSubmit: SubmitHandler<FormValues> = data => console.log(data);

  return (
    <StyledWorldCafeForm onSubmit={handleSubmit(onSubmit)}>
      <StyledStepper>
        <li className={step === 'basics' ? 'medium ' : ''}>Básicos</li>

        <li className={step === 'questions' ? 'medium ' : ''}>Preguntas</li>
      </StyledStepper>

      <button onClick={returnToBeginning}>return to beginning ---- </button>
      {'  '}
      <button onClick={handleNextStep}>scroll to</button>

      <div id="step-general" className={step !== 'basics' ? 'hidden' : ''}>
        <NewInput label="Title" {...register('title')} isDirty={dirtyFields.title} />
        <NewTextarea
          label="Description"
          {...register('description')}
          isDirty={dirtyFields.description}
        />

        <TitleWithDivider regularWeight headingLevel="h4">
          Opciones avanzadas
        </TitleWithDivider>

        <TimeZoneSelector
          placeholder="Timezone"
          label="Time zone"
          id="timezone"
          variant="small"
          {...register('timezone')}
        />

        <DatePicker
          placeholderText="Choose a date"
          label="Date"
          icon="calendar"
          control={control}
          name="date"
          id="date"
          variant="small"
          minDate={new Date()}
        />

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
      <div id="step-questions" className={step !== 'questions' ? 'hidden' : ''}>
        <h3>Questions</h3>
        <div className="questions">
          {fields.map((field, index) => (
            <div
              className="question"
              key={field.id}
              onMouseDown={event => handleShowDescription(event)}
            >
              {fields.length > 2 && (
                <StyledDeleteButton onClick={() => handleDeleteTopic(index)}>
                  Delete
                </StyledDeleteButton>
              )}
              <NewTextarea
                placeholder={`Pregunta ${index + 1}`}
                placeholderStyle="large-text"
                variant="large-text"
                {...register(`questions.${index}.title`)}
              />
              <NewTextarea
                placeholder="Si lo necesitas, añade descripción."
                className="description"
                {...register(`questions.${index}.description`)}
              />
            </div>
          ))}
        </div>
        <StyledAddButton onClick={handleAddNewTopic}>+ Add topic</StyledAddButton>

        <h3>Round duration</h3>

        <Select
          icon="clock"
          label="Cada ronda dura"
          {...register('roundDuration')}
          defaultValue={10}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </Select>

        <Switch
          full
          id="addExtraTime"
          label="Añadir 5 minutos extra a la primera ronda"
          tooltipText={
            'Te recomendamos añadir 5 minutos extra en la primera ronda, las personas suelen necesitar un poco más de tiempo para entrar en acción.'
          }
          {...register('addExtraTime')}
        />
      </div>
    </StyledWorldCafeForm>
  );
};

export default WorldCafeForm;
