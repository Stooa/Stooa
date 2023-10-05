/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import * as Yup from 'yup';
import countriesAndTimezones from 'countries-and-timezones';

import { ROUTE_FISHBOWL_DETAIL } from '@/app.config';
import { locales } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { CREATE_FISHBOWL, UPDATE_FISHBOWL } from '@/lib/gql/Fishbowl';
import { formatDateTime, nearestQuarterHour } from '@/lib/helpers';
import { pushEventDataLayer } from '@/lib/analytics';

import StandardForm, { TextDivider } from '@/ui/Form';
import SubmitBtn from '@/components/Web/SubmitBtn';
import FormError from '@/components/Web/Forms/FormError';

import { Fishbowl } from '@/types/api-platform';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '@/components/Common/Fields/Input';
import NewTextarea from '@/components/Common/Fields/Textarea';
import DatePicker from '@/components/Common/Fields/DatePicker';
import Select from '@/components/Common/Fields/Select';
import Switch from '@/components/Common/Fields/Switch';
import RichEditor from '@/components/Common/RichEditor';

interface Props {
  selectedFishbowl?: Fishbowl;
  isFull?: boolean;
  isEditForm?: boolean;
  onSaveCallback?: (data: Fishbowl) => void;
}

interface FormValues {
  id?: string;
  title: string;
  day: Date;
  time: Date;
  hours: string;
  description: string;
  language: string;
  timezone: string;
  hasIntroduction: boolean;
  isPrivate: boolean;
  plainPassword?: string;
  editInvitation: boolean;
}

const initialValues = {
  title: '',
  day: new Date(),
  time: nearestQuarterHour(),
  hours: '01:00',
  description: '',
  language: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  hasIntroduction: false,
  isPrivate: false,
  plainPassword: undefined
  // hasInvitationInfo: false
};

const mapSelectedFishbowl = (fishbowl: Fishbowl): FormValues => {
  const timestamp = new Date(fishbowl.startDateTimeTz).getTime();

  // Extract timezone difference from startDateTimeTz in minutes
  const timezoneDiff = parseInt(fishbowl.startDateTimeTz.slice(-5, -3), 10) * 60;
  const sign = fishbowl.startDateTimeTz.charAt(fishbowl.startDateTimeTz.length - 6);
  const timezoneDifferenceInMs = (sign === '-' ? -timezoneDiff : timezoneDiff) * 60000;

  // Adjust by the difference between the extracted timezone and user's local timezone
  const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
  const adjustedTime = timestamp + timezoneDifferenceInMs + userTimezoneOffset;

  const formattedDate = new Date(adjustedTime);

  return {
    id: fishbowl.id,
    title: fishbowl.name ?? '',
    day: formattedDate,
    time: formattedDate,
    hours: fishbowl.durationFormatted ?? '',
    description: fishbowl.description ?? '',
    language: fishbowl.locale,
    timezone: fishbowl.timezone,
    hasIntroduction: fishbowl.hasIntroduction ?? false,
    isPrivate: fishbowl.isPrivate,
    plainPassword: fishbowl.isPrivate ? fishbowl.plainPassword : ''
    // hasInvitationInfo: fishbowl.hasInvitationInfo
  };
};

const FishbowlForm = ({
  selectedFishbowl,
  isFull = false,
  isEditForm = false,
  onSaveCallback
}: Props) => {
  const { t, lang } = useTranslation('form');
  const timezones = countriesAndTimezones.getAllTimezones();

  const [backendErrors, setBackendErrors] = useState<Record<string, unknown>>();
  const [success, setSuccess] = useState<boolean>();
  const router = useRouter();

  const { user, updateCreateFishbowl } = useAuth();

  const [createFishbowl] = useMutation(CREATE_FISHBOWL);
  const [updateFishbowl] = useMutation(UPDATE_FISHBOWL);

  const defaultTitle = t('defaultTitle', {
    name: user && user.name ? user.name.split(' ')[0] : ''
  });
  const getRandomPassword = useCallback(() => {
    return Math.random().toString(36).substring(2, 10);
  }, []);

  const requiredError = t('validation.required');
  const minimumLength = t('validation.fishbowlPasswordLength');
  // const dateError = t('validation.date');

  const schema = Yup.object({
    title: Yup.string().matches(/[^-\s]/, {
      excludeEmptyString: true,
      message: t('validation.title')
    }),
    description: Yup.string().nullable(),
    language: Yup.string().required(requiredError),
    day: Yup.string().required(requiredError),
    time: Yup.string().required(requiredError),
    hours: Yup.string().required(requiredError),
    timezone: Yup.string().required(requiredError),
    plainPassword: Yup.string().when('isPrivate', {
      is: true,
      then: Yup.string().min(8, minimumLength).required(requiredError)
    })
  });

  const methods = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { ...initialValues, language: lang, plainPassword: getRandomPassword() }
  });

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    watch,
    formState: { dirtyFields, errors, isSubmitting, isSubmitted }
  } = methods;

  const watchIsPrivate = watch('isPrivate');

  const onCompletedSubmit = res => {
    if (res.type === 'Error') {
      console.error('[STOOA] Error', res);
      setBackendErrors(res.data);
      setTimeout(() => {
        setBackendErrors(undefined);
      }, 7000);
    } else {
      if (isEditForm) {
        const formattedFishbowl = {
          ...res.data.updateFishbowl.fishbowl,
          id: res.data.updateFishbowl.fishbowl.id.substring(11)
        };

        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 5000);

        if (onSaveCallback) {
          onSaveCallback(formattedFishbowl);
        }
      } else {
        const {
          data: {
            createFishbowl: { fishbowl }
          }
        } = res;

        const route = `${ROUTE_FISHBOWL_DETAIL}/${fishbowl.slug}`;

        if (fishbowl.hasIntroduction) {
          pushEventDataLayer({
            action: 'activate',
            category: 'Sharescreen',
            label: fishbowl.slug
          });
        }

        updateCreateFishbowl(true);
        router.push(route, route, { locale: lang });
      }
    }
  };

  const onSubmit = async values => {
    const dayFormatted = formatDateTime(values.day);
    const timeFormatted = formatDateTime(values.time);

    if (isEditForm) {
      pushEventDataLayer({
        category: 'Modify Fishbowl',
        action: 'Fishbowl List',
        label: values.id
      });

      await updateFishbowl({
        variables: {
          input: {
            id: `/fishbowls/${values.id}`,
            name: values.title === '' ? defaultTitle : values.title,
            description: values.description,
            startDateTime: `${dayFormatted.date} ${timeFormatted.time}`,
            timezone: values.timezone,
            duration: values.hours,
            locale: values.language,
            isFishbowlNow: false,
            hasIntroduction: values.hasIntroduction,
            isPrivate: values.isPrivate,
            plainPassword: values.isPrivate ? values.plainPassword : undefined
          }
        }
      })
        .then(res => {
          onCompletedSubmit(res);
        })
        .catch(error => {
          onCompletedSubmit({
            type: 'Error',
            data: error
          });
        });
    } else {
      await createFishbowl({
        variables: {
          input: {
            name: values.title,
            description: values.description,
            startDateTime: `${dayFormatted.date} ${timeFormatted.time}`,
            timezone: values.timezone,
            duration: values.hours,
            locale: values.language,
            isFishbowlNow: false,
            hasIntroduction: values.hasIntroduction,
            isPrivate: values.isPrivate,
            plainPassword:
              values.isPrivate && values.plainPassword ? values.plainPassword : undefined,
            hasInvitationInfo: false
          }
        }
      })
        .then(res => {
          onCompletedSubmit(res);
        })
        .catch(error => {
          onCompletedSubmit({
            type: 'Error',
            data: error
          });
        });
    }
  };

  useEffect(() => {
    if (isEditForm && selectedFishbowl) {
      const formattedFishbowl = mapSelectedFishbowl(selectedFishbowl);
      reset(formattedFishbowl, {
        keepDefaultValues: true
      });
    }
  }, [isEditForm, selectedFishbowl, reset]);

  const today = new Date();

  return (
    <FormProvider {...methods}>
      {backendErrors && <FormError errors={backendErrors} />}
      <StandardForm onSubmit={handleSubmit(onSubmit)} $isFull={isFull}>
        <fieldset className="fieldset-inline">
          <Input
            isSubmitted={isSubmitted}
            isDirty={dirtyFields.title}
            hasError={errors.title}
            data-testid="edit-form-title"
            placeholder={defaultTitle}
            label={t('fishbowl.title')}
            type="text"
            autoComplete="off"
            id="title"
            {...register('title')}
          />
          <NewTextarea
            isDirty={dirtyFields.description}
            hasError={errors.description}
            data-testid="edit-form-description"
            label={t('fishbowl.description')}
            autoComplete="off"
            id="description"
            taller
            {...register('description')}
          />
          <DatePicker
            hasError={errors.day}
            data-testid="edit-form-date"
            label={t('fishbowl.day')}
            placeholderText={t('fishbowl.selectDay')}
            id="day"
            dateFormat="dd/MM/yyyy"
            icon="calendar"
            autoComplete="off"
            variant="small"
            name="day"
            minDate={today}
          />
          <DatePicker
            hasError={errors.time}
            data-testid="edit-form-time"
            label={t('fishbowl.time')}
            placeholderText={t('fishbowl.selectTime')}
            id="time"
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            dateFormat="HH:mm"
            icon="clock"
            autoComplete="off"
            variant="small"
            name="time"
            minDate={today}
          />
          <Select
            isDirty={dirtyFields.hours}
            hasError={errors.hours}
            label={t('fishbowl.duration')}
            id="hours"
            variant="small"
            icon="hourglass"
            autoComplete="off"
            {...register('hours')}
          >
            {[...Array(9)].map((e, i) => {
              if (i === 0) {
                return (
                  <option key="hour_placeholder" value="">
                    {t('fishbowl.selectDuration')}
                  </option>
                );
              }

              const nquarters = 2;
              const hours = Math.floor(i / nquarters);
              const quarterHours = ['00', '30'];
              const minutes = quarterHours[i % nquarters];
              const time = `${hours.toString().length > 1 ? hours : `0${hours}`}:${minutes}`;

              return (
                <option
                  defaultValue={(time === getValues('hours')).toString()}
                  key={`hour_${time}`}
                  value={time}
                >{`${time} ${t('fishbowl.hours')}`}</option>
              );
            })}
          </Select>
        </fieldset>
        <fieldset className="fieldset-inline advanced-options">
          <TextDivider>
            <p>{t('fishbowl.advancedOptions')}</p>
            <span></span>
          </TextDivider>
          <Select
            isDirty={dirtyFields.timezone}
            hasError={errors.timezone}
            className="select"
            label={t('fishbowl.timezone')}
            id="timezone"
            icon="world"
            autoComplete="off"
            {...register('timezone')}
          >
            <option value="">{t('fishbowl.selectTimeZone')}</option>
            {Object.keys(timezones).map((zone, index) => {
              const text = `(GTM${timezones[zone].utcOffsetStr}) ${timezones[zone].name}`;
              return (
                <option key={`zone_${index}`} value={zone}>
                  {text}
                </option>
              );
            })}
          </Select>
          <Select
            isDirty={dirtyFields.language}
            hasError={errors.language}
            className="select"
            label={t('fishbowl.language')}
            id="language"
            icon="language"
            autoComplete="off"
            {...register('language')}
          >
            <option value="">{t('fishbowl.selectLanguageLabel')}</option>
            {locales.map(locale => (
              <option value={locale} key={`locale-${locale}`}>
                {t(`common:languages.${locale}`)}
              </option>
            ))}
          </Select>
          <Switch
            id="hasIntroduction"
            full
            tooltipText={
              <Trans
                i18nKey="form:fishbowl.introductionTooltip"
                components={{ span: <span className="medium" /> }}
              />
            }
            label={t('fishbowl.introductionLabel')}
            {...register('hasIntroduction')}
          />
          <Switch
            id="isPrivate"
            full
            tooltipText={
              <Trans
                i18nKey="form:fishbowl.passwordTooltip"
                components={{ span: <span className="medium" /> }}
              />
            }
            label={t('fishbowl.isPrivate')}
            {...register('isPrivate')}
          />
          {watchIsPrivate && (
            <Input
              isDirty={dirtyFields.plainPassword}
              hasError={errors.plainPassword}
              data-testid="fishbowl-form-passwordinput"
              placeholder={t('fishbowl.passwordPlaceholder')}
              label={t('fishbowl.passwordInputLabel')}
              type="text"
              autoComplete="off"
              id="plainPassword"
              icon="lock"
              {...register('plainPassword')}
            />
          )}

          {/* <Switch
            id="hasInvitationInfo"
            full
            tooltipText={'Edit the content of your invitation, as the title and the body'}
            label={'Edit invitation content.'}
            {...register('hasInvitationInfo')}
          /> */}

          <RichEditor />
        </fieldset>
        <fieldset>
          <SubmitBtn
            data-testid="fishbowl-submit"
            text={isEditForm ? t('button.modifyFishbowl') : t('button.createFishbowl')}
            disabled={isSubmitting}
          />
          {success && (
            <span className="success-message-bottom">{t('validation.successMessage')}</span>
          )}
        </fieldset>
      </StandardForm>
    </FormProvider>
  );
};

export default FishbowlForm;
