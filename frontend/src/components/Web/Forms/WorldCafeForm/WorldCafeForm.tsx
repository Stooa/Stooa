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
import { useMutation } from '@apollo/client';
import { CREATE_WORLD_CAFE } from '@/graphql/WorldCafe';
import CheckmarkSVG from '@/ui/svg/checkmark.svg';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type Question = {
  title: string;
  description: string;
};

interface FormValues {
  title: string;
  description: string;
  date: Date;
  time: string;
  timezone: string;
  language: string;
  roundDuration: number;
  addExtraTime: boolean;
  questions: Question[];
}

const WorldCafeForm = () => {
  const [step, setStep] = useState<'basics' | 'questions'>('basics');
  const [createWorldCafe] = useMutation(CREATE_WORLD_CAFE);

  const validationSchema = yup.object({
    title: yup.string().matches(/[^-\s]/, {
      excludeEmptyString: true,
      message: 'Title cannot be empty'
    }),
    description: yup.string(),
    timezone: yup.string().required('Timezone is required'),
    date: yup.date().required('Date is required')
  });

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors, dirtyFields, isValid }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: '',
      description: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      date: new Date(),
      time: '',
      language: 'en',
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

  const handleAddNewTopic = event => {
    event.preventDefault();
    append({ title: '', description: '' });
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

    description.classList.add('show');
  };

  const onSubmit: SubmitHandler<FormValues> = data => {
    console.log(data);
    createWorldCafe({
      variables: {
        input: {
          name: data.title,
          description: data.description,
          startDateTime: '2023-12-25T18:48:58.091Z',
          timezone: data.timezone,
          locale: data.language,
          hasExtraRoundTime: data.addExtraTime,
          roundMinutes: data.roundDuration,
          questions: data.questions
        }
      }
    })
      .then(res => {
        console.log('[STOOA] World Café created', res);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <StyledWorldCafeForm onSubmit={handleSubmit(onSubmit)}>
      <StyledStepper>
        <li id="basics" onClick={returnToBeginning}>
          <div className={`status ${step === 'questions' ? 'done' : ''}`}>
            {step === 'questions' ? <CheckmarkSVG /> : '1'}
          </div>{' '}
          Básicos
        </li>

        <div />

        <li className={` ${step === 'questions' ? 'current' : 'disabled'}`}>Preguntas</li>
      </StyledStepper>

      <div id="step-general" className={step !== 'basics' ? 'hidden' : ''}>
        <NewInput
          label="Title"
          {...register('title')}
          isDirty={dirtyFields.title}
          hasError={errors['title']}
        />
        <NewTextarea
          label="Description"
          {...register('description')}
          isDirty={dirtyFields.description}
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

        <DatePicker
          placeholderText="Choose a time"
          label="Empieza a las"
          icon="clock"
          showTimeSelect
          showTimeSelectOnly
          dateFormat="H:mm"
          control={control}
          name="time"
          id="time"
          variant="small"
          minDate={new Date()}
        />

        <TitleWithDivider regularWeight headingLevel="h4">
          Opciones avanzadas
        </TitleWithDivider>

        <TimeZoneSelector
          placeholder="Timezone"
          name="timezone"
          label="Time zone"
          defaultValue={getValues('timezone')}
          register={register}
        />

        <Select icon="language" label="Idioma" {...register('language')}>
          <option value="es">Castellano</option>
          <option value="en">Inglés</option>
          <option value="fr">Francés</option>
          <option value="ca">Catalán</option>
        </Select>

        <Button
          data-testid="feedback-comment-send-button"
          type="submit"
          color="primary"
          variant="text"
          onClick={handleNextStep}
          disabled={!isValid}
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
        {fields.length < 5 && (
          <StyledAddButton onClick={handleAddNewTopic}>+ Add topic</StyledAddButton>
        )}

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

        <Button full data-testid="world-cafe-form-submit-button" disabled={!isValid} type="submit">
          Crear world cafe
        </Button>
      </div>
    </StyledWorldCafeForm>
  );
};

export default WorldCafeForm;
