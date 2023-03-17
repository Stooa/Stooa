/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { FetchResult, useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import { withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';
import countriesAndTimezones from 'countries-and-timezones';

import { ROUTE_FISHBOWL_DETAIL } from '@/app.config';
import { locales } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { CREATE_FISHBOWL, UPDATE_FISHBOWL } from '@/lib/gql/Fishbowl';
import { formatDateTime, nearestQuarterHour } from '@/lib/helpers';
import { pushEventDataLayer } from '@/lib/analytics';

import FormikForm, { TextDivider } from '@/ui/Form';
import Input from '@/components/Common/Fields/Input';
import Textarea from '@/components/Common/Fields/Textarea';
import Select from '@/components/Common/Fields/Select';
import DatePicker from '@/components/Common/Fields/DatePicker';
import SubmitBtn from '@/components/Web/SubmitBtn';
import FormError from '@/components/Web/Forms/FormError';
import Switch from '@/components/Common/Fields/Switch';

import { CreateFishbowlOptions, UpdateFishbowlOptions } from '@/types/graphql/fishbowl';
import { Fishbowl } from '@/types/api-platform';

interface FormProps {
  required: string;
  minimumLength: string;
  success?: boolean;
  date: string;
  title: string;
  defaultTitle: string;
  createFishbowl: (
    options?: CreateFishbowlOptions
  ) => Promise<FetchResult<unknown, Record<string, unknown>, Record<string, unknown>>>;
  updateFishbowl: (
    options?: UpdateFishbowlOptions
  ) => Promise<FetchResult<unknown, Record<string, unknown>, Record<string, unknown>>>;
  onSubmit: (any) => void;
  currentLanguage: string;
  enableReinitialize?: boolean;
  selectedFishbowl?: FormValues;
  isFull?: boolean;
  isEditForm?: boolean;
  randomPassword?: string;
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
};

const Form = (props: FormProps & FormikProps<FormValues>) => {
  const { isSubmitting, success, defaultTitle } = props;
  const { t } = useTranslation('form');
  const timezones = countriesAndTimezones.getAllTimezones();

  return (
    <FormikForm $isFull={props.isFull}>
      <fieldset className="fieldset-inline">
        <Input
          data-testid="edit-form-title"
          placeholder={defaultTitle}
          label={t('fishbowl.title')}
          name="title"
          type="text"
          autoComplete="off"
          id="title"
        />
        <Textarea
          data-testid="edit-form-description"
          label={t('fishbowl.description')}
          name="description"
          validation={false}
          autoComplete="off"
          id="description"
          taller
        />
        <DatePicker
          data-testid="edit-form-date"
          label={t('fishbowl.day')}
          placeholderText={t('fishbowl.selectDay')}
          name="day"
          id="day"
          minDate={new Date()}
          dateFormat="dd/MM/yyyy"
          icon="calendar"
          autoComplete="off"
          variant="sm"
        />
        <DatePicker
          data-testid="edit-form-time"
          label={t('fishbowl.time')}
          placeholderText={t('fishbowl.selectTime')}
          name="time"
          id="time"
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          dateFormat="H:mm"
          icon="clock"
          autoComplete="off"
          variant="sm"
        />
        <Select
          label={t('fishbowl.duration')}
          name="hours"
          id="hours"
          variant="sm"
          icon="hourglass"
          autoComplete="off"
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
                defaultValue={(time === props.values.hours).toString()}
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
          className="select"
          label={t('fishbowl.timezone')}
          name="timezone"
          id="timezone"
          icon="world"
          autoComplete="off"
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
          className="select"
          label={t('fishbowl.language')}
          name="language"
          id="language"
          icon="language"
          autoComplete="off"
        >
          <option value="">{t('fishbowl.selectLanguageLabel')}</option>
          {locales.map(locale => (
            <option value={locale} key={`locale-${locale}`}>
              {t(`common:languages.${locale}`)}
            </option>
          ))}
        </Select>
        <Switch
          tooltipText={
            <Trans
              i18nKey="form:fishbowl.introductionTooltip"
              components={{ span: <span className="medium" /> }}
            />
          }
          label={t('fishbowl.introductionLabel')}
          name="hasIntroduction"
        />
        <Switch
          tooltipText={
            <Trans
              i18nKey="form:fishbowl.passwordTooltip"
              components={{ span: <span className="medium" /> }}
            />
          }
          label={t('fishbowl.isPrivate')}
          name="isPrivate"
        />
        {props.values.isPrivate && (
          <Input
            value={props.values.isPrivate ? props.values.plainPassword : undefined}
            data-testid="fishbowl-form-passwordinput"
            placeholder={t('fishbowl.passwordPlaceholder')}
            label={t('fishbowl.passwordInputLabel')}
            name="plainPassword"
            type="text"
            autoComplete="off"
            id="plainPassword"
            icon="lock"
          />
        )}
      </fieldset>
      <fieldset>
        {success && (
          <span className="success-message-bottom">{t('validation.successMessage')}</span>
        )}
        <SubmitBtn
          data-testid="fishbowl-submit"
          text={props.selectedFishbowl ? t('button.modifyFishbowl') : t('button.createFishbowl')}
          disabled={isSubmitting}
        />
      </fieldset>
    </FormikForm>
  );
};

const FormValidation = withFormik<FormProps, FormValues>({
  mapPropsToValues: props => {
    return {
      ...(props.selectedFishbowl
        ? props.selectedFishbowl
        : { ...initialValues, plainPassword: props.randomPassword }),
      ...(!props.isEditForm && { language: props.currentLanguage })
    };
  },
  validationSchema: props => {
    return Yup.object({
      title: Yup.string().matches(/[^-\s]/, {
        excludeEmptyString: true,
        message: props.title
      }),
      description: Yup.string().nullable(),
      language: Yup.string().required(props.required),
      day: Yup.string().required(props.required),
      time: Yup.string().required(props.required),
      hours: Yup.string().required(props.required),
      timezone: Yup.string().required(props.required),
      plainPassword: Yup.string().when('isPrivate', {
        is: true,
        then: Yup.string().min(8, props.minimumLength).required(props.required)
      })
    });
  },
  handleSubmit: async (values, { props, setSubmitting }) => {
    const dayFormatted = formatDateTime(values.day);
    const timeFormatted = formatDateTime(values.time);

    if (props.isEditForm) {
      pushEventDataLayer({
        category: 'Modify Fishbowl',
        action: 'Fishbowl List',
        label: values.id
      });

      await props
        .updateFishbowl({
          variables: {
            input: {
              id: `/fishbowls/${values.id}`,
              name: values.title === '' ? props.defaultTitle : values.title,
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
          setSubmitting(false);
          props.onSubmit(res);
        })
        .catch(error => {
          setSubmitting(false);
          props.onSubmit({
            type: 'Error',
            data: error
          });
        });
    } else {
      await props
        .createFishbowl({
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
                values.isPrivate && values.plainPassword ? values.plainPassword : undefined
            }
          }
        })
        .then(res => {
          setSubmitting(false);
          props.onSubmit(res);
        })
        .catch(error => {
          setSubmitting(false);
          props.onSubmit({
            type: 'Error',
            data: error
          });
        });
    }
  }
})(Form);

const FishbowlForm = ({
  selectedFishbowl,
  $isFull = false,
  isEditForm = false,
  onSaveCallback
}: {
  selectedFishbowl?: Fishbowl;
  $isFull?: boolean;
  isEditForm?: boolean;
  onSaveCallback?: (data: Fishbowl) => void;
}) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState<boolean>();
  const router = useRouter();
  const [createFishbowl] = useMutation(CREATE_FISHBOWL);
  const [updateFishbowl] = useMutation(UPDATE_FISHBOWL);
  const { t, lang } = useTranslation('form');
  const { user, updateCreateFishbowl } = useAuth();

  const defaultTitle = t('defaultTitle', {
    name: user && user.name ? user.name.split(' ')[0] : ''
  });

  const requiredError = t('validation.required');
  const minimumLength = t('validation.fishbowlPasswordLength');
  const dateError = t('validation.date');
  const titleError = t('validation.title');

  const getRandomPassword = useCallback(() => {
    return Math.random().toString(36).substring(2, 10);
  }, []);

  const handleOnSubmit = res => {
    if (res.type === 'Error') {
      console.error('[STOOA] Error', res);
      setError(res.data);
      setTimeout(() => {
        setError(null);
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

  let selectedFishbowlValues: FormValues | undefined = undefined;

  if (selectedFishbowl) {
    const stringDate = selectedFishbowl.startDateTimeTz.toString();
    const timezone = stringDate.substring(stringDate.length - 5, stringDate.length - 3);
    const sign = stringDate.substring(stringDate.length - 6, stringDate.length - 5);
    const hoursInMs = parseInt(timezone) * 60 * 60 * 1000;

    const timestamp = new Date(selectedFishbowl.startDateTimeTz).getTime();
    const UTCDate = new Date(new Date(timestamp + (sign === '-' ? -1 * hoursInMs : hoursInMs)));
    const userTimezone = UTCDate.getTimezoneOffset() * 60000;
    const newDate = new Date(UTCDate.getTime() + userTimezone);

    selectedFishbowlValues = {
      id: selectedFishbowl.id,
      title: selectedFishbowl.name ?? '',
      day: newDate,
      time: newDate,
      hours: selectedFishbowl.durationFormatted ?? '',
      description: selectedFishbowl.description ?? '',
      language: selectedFishbowl.locale,
      timezone: selectedFishbowl.timezone,
      hasIntroduction: selectedFishbowl.hasIntroduction ?? false,
      isPrivate: selectedFishbowl.isPrivate,
      plainPassword: selectedFishbowl.isPrivate ? selectedFishbowl.plainPassword : ''
    };
  }

  return (
    <>
      {error && <FormError errors={error} />}
      <FormValidation
        isFull={$isFull}
        title={titleError}
        defaultTitle={defaultTitle}
        enableReinitialize
        required={requiredError}
        minimumLength={minimumLength}
        success={success}
        date={dateError}
        createFishbowl={createFishbowl}
        updateFishbowl={updateFishbowl}
        onSubmit={handleOnSubmit}
        currentLanguage={lang}
        selectedFishbowl={selectedFishbowlValues}
        isEditForm={isEditForm}
        randomPassword={getRandomPassword()}
      />
    </>
  );
};

export default FishbowlForm;
