/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useState } from 'react';
import { useRouter } from 'next/router';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useTranslation from 'next-translate/useTranslation';

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
import BinSVG from '@/ui/svg/bin.svg';

import { formatDateTime, nearestQuarterHour } from '@/lib/helpers';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTE_WORLD_CAFE_DETAIL } from '@/app.config';

type Question = {
  title: string;
  description: string;
};

interface FormValues {
  title: string;
  description: string;
  date: Date;
  time: Date;
  timezone: string;
  language: string;
  roundDuration: number;
  addExtraTime: boolean;
  questions: Question[];
}

const WorldCafeForm = () => {
  const [step, setStep] = useState<'basics' | 'questions'>('basics');
  const { user } = useAuth();
  const { t } = useTranslation('form');
  const [createWorldCafe] = useMutation(CREATE_WORLD_CAFE);
  const today = new Date();
  const router = useRouter();

  const validationSchema = yup.object({
    title: yup
      .string()
      .max(255, 'Title cannot be longer than 255 characters')
      .matches(/[^-\s]/, {
        excludeEmptyString: true,
        message: 'Title cannot be empty'
      }),
    description: yup.string().max(500, 'Description cannot be longer than 500 characters'),
    timezone: yup.string().required('Timezone is required'),
    date: yup.date().required('Date is required'),
    time: yup.date().required('Time is required'),
    language: yup.string().required('Language is required'),
    roundDuration: yup.number().required('Round duration is required'),
    addExtraTime: yup.boolean(),
    questions: yup.array().of(
      yup.object().shape({
        title: yup.string().required('Title is required'),
        description: yup.string()
      })
    )
  });

  const defaultTitle = t('worldCafe.defaults.title', {
    name: user && user.name ? user.name.split(' ')[0] : ''
  });

  // TODO: GET ERRORS!!!

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
      date: today,
      time: nearestQuarterHour(),
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

    console.log(event.target);
    if (elementClicked.classList.contains('delete')) return;

    const description =
      elementClicked.parentElement.parentElement.querySelector('textarea.description');

    description.classList.add('show');
  };

  const onSubmit: SubmitHandler<FormValues> = data => {
    const dayFormatted = formatDateTime(data.date);
    const timeFormatted = formatDateTime(data.time);

    console.log(data);
    createWorldCafe({
      variables: {
        input: {
          name: data.title,
          description: data.description,
          startDateTime: `${dayFormatted.date} ${timeFormatted.time}`,
          timezone: data.timezone,
          locale: data.language,
          hasExtraRoundTime: data.addExtraTime,
          roundMinutes: data.roundDuration,
          questions: data.questions.map((question, index) => ({
            title: question.title,
            description: question.description,
            position: index
          }))
        }
      }
    })
      .then(res => {
        console.log('[STOOA] World Café created', res);

        const {
          data: {
            createWorldCafe: { worldCafe }
          }
        } = res;

        const route = `${ROUTE_WORLD_CAFE_DETAIL}/${worldCafe.slug}`;

        router.push(route, route, { locale: data.language });
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <StyledWorldCafeForm onSubmit={handleSubmit(onSubmit)}>
      <StyledStepper>
        <li id="basics" onClick={returnToBeginning}>
          <div className={`status ${step === 'questions' ? 'done' : 'highlighted'}`}>
            {step === 'questions' ? <CheckmarkSVG /> : '1'}
          </div>
          {t('worldCafe.basics')}
        </li>

        <div className={step === 'questions' ? 'green' : ''} />

        <li className={`${step === 'questions' ? 'current' : 'disabled'}`}>
          <div className={`status ${step === 'questions' ? 'highlighted' : 'current'}`}>2</div>
          {t('worldCafe.questions')}
        </li>
      </StyledStepper>

      <div id="step-general" className={step !== 'basics' ? 'hidden' : ''}>
        <fieldset>
          <NewInput
            label={t('worldCafe.title')}
            {...register('title')}
            placeholder={defaultTitle}
            isDirty={dirtyFields.title}
            hasError={errors.title}
          />

          <NewTextarea
            label={t('worldCafe.description')}
            {...register('description')}
            isDirty={dirtyFields.description}
            hasError={errors.description}
          />

          <DatePicker
            placeholderText="Choose a date"
            label={t('worldCafe.date')}
            icon="calendar"
            control={control}
            name="date"
            id="date"
            variant="small"
            minDate={today}
          />

          <DatePicker
            placeholderText="Choose a time"
            label={t('worldCafe.time')}
            icon="clock"
            showTimeSelect
            showTimeSelectOnly
            dateFormat="HH:mm"
            control={control}
            name="time"
            id="time"
            variant="small"
            minTime={new Date()}
            maxTime={new Date(today.setHours(23, 45))}
            hasError={errors.time}
          />
        </fieldset>

        <fieldset>
          <TitleWithDivider regularWeight headingLevel="h4">
            {t('worldCafe.advancedOptions')}
          </TitleWithDivider>
          <TimeZoneSelector
            placeholder="Timezone"
            name="timezone"
            label={t('worldCafe.timezone')}
            defaultValue={getValues('timezone')}
            register={register}
          />

          <Select icon="language" label={t('worldCafe.language')} {...register('language')}>
            <option value="es">Castellano</option>
            <option value="en">Inglés</option>
            <option value="fr">Francés</option>
            <option value="ca">Catalán</option>
          </Select>
        </fieldset>

        <Button
          data-testid="feedback-comment-send-button"
          type="submit"
          color="primary"
          full
          onClick={handleNextStep}
          // disabled={!isValid}
        >
          {t('worldCafe.next')}
        </Button>
      </div>

      {/* QUESTIONS */}
      <div id="step-questions" className={step !== 'questions' ? 'hidden' : ''}>
        <fieldset>
          <h3>{t('worldCafe.questions')}</h3>
          <div className="questions">
            {fields.map((field, index) => (
              <div
                className="question"
                key={field.id}
                onMouseDown={event => handleShowDescription(event)}
              >
                <StyledDeleteButton
                  className="delete"
                  disabled={fields.length < 3}
                  onClick={() => handleDeleteTopic(index)}
                >
                  <BinSVG />
                </StyledDeleteButton>

                <NewTextarea
                  placeholder={t('worldCafe.defaults.question', {number: index + 1})}
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
            <StyledAddButton onClick={handleAddNewTopic}>
              + {t('worldCafe.addQuestion')}
            </StyledAddButton>
          )}
        </fieldset>

        <fieldset>
          <h3>{t('worldCafe.roundDuration')}</h3>

          <Select
            id="roundDuration"
            icon="clock"
            label="Cada ronda dura"
            {...register('roundDuration')}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
          </Select>

          <Switch
            full
            id="addExtraTime"
            label={t('worldCafe.add5MinutesLabel')}
            tooltipText={t('worldCafe.add5MinutesTooltip')}
            {...register('addExtraTime')}
          />
        </fieldset>

        <Button
          full
          data-testid="world-cafe-form-submit-button"
          disabled={!isValid}
          type="submit"
          variant="primary"
        >
          {t('worldCafe.submit')}
        </Button>
      </div>
    </StyledWorldCafeForm>
  );
};

export default WorldCafeForm;
