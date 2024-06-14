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
import { useMutation } from '@apollo/client';
import { CREATE_WORLD_CAFE } from '@/graphql/WorldCafe';

import Button from '@/components/Common/Button';
import Input from '@/components/Common/Fields/Input';
import Textarea from '@/components/Common/Fields/Textarea';
import { FieldValues, FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { StyledAddButton, StyledDeleteButton, StyledStepper, StyledWorldCafeForm } from './styles';
import Select from '@/components/Common/Fields/Select';
import Switch from '@/components/Common/Fields/Switch';
import TitleWithDivider from '@/components/Common/TitleWithDivider/TitleWithDivider';
import { TimeZoneSelector } from '@/components/Common/TimezoneSelector/TimeZoneSelector';
import DatePicker from '@/components/Common/Fields/DatePicker';
import TitleWithFullColoredTooltip from '@/components/Common/TitleWithFullColoredTooltip/TitleWithFullColoredTooltip';

import CheckmarkSVG from '@/ui/svg/checkmark.svg';
import BinSVG from '@/ui/svg/bin.svg';
import ArrowRightSVG from '@/ui/svg/arrow-right.svg';

import { formatDateTime, nearestQuarterHour } from '@/lib/helpers';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTE_WORLD_CAFE } from '@/app.config';
import { locales } from '@/i18n';
import FormError from '../FormError';

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

export type WorldCafeFormValues = FormValues & FieldValues;

const WorldCafeForm = () => {
  const [formError, setFormError] = useState();
  const [showDescription, setShowDescription] = useState({});
  const [step, setStep] = useState<'basics' | 'questions'>('basics');
  const { user } = useAuth();
  const { t, lang } = useTranslation('form');
  const [createWorldCafe] = useMutation(CREATE_WORLD_CAFE);
  const today = new Date();
  const router = useRouter();

  const validationSchema = yup.object({
    title: yup
      .string()
      .max(255, t('validation.maxLength', { length: 255 }))
      .matches(/[^-\s]/, {
        excludeEmptyString: true,
        message: t('validation.notEmpty')
      }),
    description: yup
      .string()
      .max(500, t('validation.maxLength', { length: 500 }))
      .matches(/[^-\s]/, {
        excludeEmptyString: true,
        message: 'Description cannot be empty'
      }),
    timezone: yup.string().required('Timezone is required'),
    date: yup.date().required('Date is required'),
    time: yup.date().required('Time is required'),
    language: yup.string().required('Language is required'),
    roundDuration: yup.number().required('Round duration is required'),
    addExtraTime: yup.boolean(),
    questions: yup.array().of(
      yup.object().shape({
        title: yup.string().matches(/[^-\s]/, {
          excludeEmptyString: true,
          message: t('validation.notEmpty')
        }),
        description: yup.string().matches(/[^-\s]/, {
          excludeEmptyString: true,
          message: t('validation.notEmpty')
        })
      })
    )
  });

  const defaultTitle = t('worldCafe.defaults.title', {
    name: user && user.name ? user.name.split(' ')[0] : ''
  });

  const methods = useForm<WorldCafeFormValues>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      date: today,
      time: nearestQuarterHour(),
      language: lang,
      roundDuration: 10,
      addExtraTime: true,
      questions: [
        { title: '', description: '' },
        { title: '', description: '' }
      ]
    }
  });

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors, dirtyFields, isValid }
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });

  const firstPartIsInvalid =
    errors.title !== undefined ||
    errors.description !== undefined ||
    errors.date !== undefined ||
    errors.time !== undefined ||
    errors.timezone !== undefined ||
    errors.language !== undefined;

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

  const handleShowDescription = (event, index: number) => {
    const elementSelected = event.target;

    if (elementSelected.classList.contains('delete')) return;

    setShowDescription(current => ({ ...current, [index]: true }));
  };

  const onSubmit: SubmitHandler<WorldCafeFormValues> = data => {
    const dayFormatted = formatDateTime(data.date);
    const timeFormatted = formatDateTime(data.time);

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
            title:
              question.title === '' ? `${t('worldCafe.question')} ${index + 1}` : question.title,
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

        const route = `${ROUTE_WORLD_CAFE}/${worldCafe.slug}`;

        router.push(route, route, { locale: data.language });
      })
      .catch(error => {
        console.log(error);
        setFormError(error);
        setStep('basics');
      });
  };

  return (
    <FormProvider {...methods}>
      <StyledWorldCafeForm onSubmit={handleSubmit(onSubmit)}>
        <StyledStepper>
          <li
            id="basics"
            className={`${step === 'basics' ? 'current' : ''}`}
            onClick={returnToBeginning}
          >
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

        {formError && <FormError errors={formError} />}

        <div id="step-general" className={step !== 'basics' ? 'hidden' : ''}>
          <fieldset>
            <Input
              label={t('fishbowl.title')}
              {...register('title')}
              placeholder={defaultTitle}
              isDirty={dirtyFields.title}
              hasError={errors.title}
            />

            <Textarea
              label={t('fishbowl.description')}
              {...register('description')}
              isDirty={dirtyFields.description}
              hasError={errors.description}
            />

            <DatePicker
              placeholderText="Choose a date"
              label={t('fishbowl.day')}
              icon="calendar"
              name="date"
              id="date"
              variant="small"
              minDate={today}
            />

            <DatePicker
              placeholderText="Choose a time"
              label={t('fishbowl.time')}
              icon="clock"
              showTimeSelect
              showTimeSelectOnly
              dateFormat="HH:mm"
              name="time"
              id="time"
              variant="small"
              hasError={errors.time}
            />
          </fieldset>

          <fieldset>
            <TitleWithDivider regularWeight headingLevel="h4">
              {t('fishbowl.advancedOptions')}
            </TitleWithDivider>
            <TimeZoneSelector
              placeholder="Timezone"
              name="timezone"
              label={t('fishbowl.timezone')}
              defaultValue={getValues('timezone')}
              register={register}
            />

            <Select icon="language" label={t('fishbowl.language')} {...register('language')}>
              {locales.map(locale => (
                <option value={locale} key={`locale-${locale}`}>
                  {t(`common:languages.${locale}`)}
                </option>
              ))}
            </Select>
          </fieldset>

          <Button
            className="next-step-button"
            data-testid="next-step-button"
            type="submit"
            color="primary"
            size="large"
            full
            onClick={handleNextStep}
            disabled={firstPartIsInvalid}
          >
            {t('worldCafe.next')} <ArrowRightSVG />
          </Button>
        </div>

        {/* QUESTIONS */}
        <div id="step-questions" className={step !== 'questions' ? 'hidden' : ''}>
          <fieldset>
            <TitleWithFullColoredTooltip
              tooltipText={t('worldCafe.questionsTooltip')}
              headingLevel="h3"
            >
              {t('worldCafe.questions')}
            </TitleWithFullColoredTooltip>
            <div className="questions">
              {fields.map((field, index) => (
                <div
                  className="question"
                  key={field.id}
                  onFocusCapture={event => handleShowDescription(event, index)}
                >
                  <Textarea
                    placeholder={t('worldCafe.defaults.question', { number: index + 1 })}
                    placeholderStyle="large-text"
                    hasError={errors.questions?.[index]?.title}
                    variant="large-text"
                    {...register(`questions.${index}.title`)}
                  />
                  {!errors.questions?.[index]?.title && (
                    <StyledDeleteButton
                      className="delete"
                      disabled={fields.length < 3}
                      onClick={() => handleDeleteTopic(index)}
                    >
                      <BinSVG />
                    </StyledDeleteButton>
                  )}

                  <Textarea
                    placeholder={t('worldCafe.descriptionPlaceholder')}
                    className={`description ${showDescription[index] ? 'show' : ''}`}
                    hasError={errors.questions?.[index]?.description}
                    {...register(`questions.${index}.description`)}
                  />
                </div>
              ))}
            </div>

            <StyledAddButton disabled={fields.length > 4} onClick={handleAddNewTopic}>
              + {t('worldCafe.addQuestion')}
            </StyledAddButton>
          </fieldset>

          <fieldset>
            <h3>{t('worldCafe.roundDuration')}</h3>

            <Select
              id="roundDuration"
              icon="clock"
              label={t('worldCafe.roundTimeLabel')}
              {...register('roundDuration')}
            >
              <option value="5">5 {t('worldCafe.minutes')}</option>
              <option value="10">10 {t('worldCafe.minutes')}</option>
              <option value="15">15 {t('worldCafe.minutes')}</option>
              <option value="20">20 {t('worldCafe.minutes')}</option>
              <option value="25">25 {t('worldCafe.minutes')}</option>
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
            size="large"
            variant="primary"
          >
            {t('worldCafe.submit')}
          </Button>
        </div>
      </StyledWorldCafeForm>
    </FormProvider>
  );
};

export default WorldCafeForm;
