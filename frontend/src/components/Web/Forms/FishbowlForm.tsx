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
import FormikForm, { TextDivider } from '@/ui/Form';
import Input from '@/components/Common/Fields/Input';
import Textarea from '@/components/Common/Fields/Textarea';
import Select from '@/components/Common/Fields/Select';
import DatePicker from '@/components/Common/Fields/DatePicker';
import SubmitBtn from '@/components/Web/SubmitBtn';
import FormError from '@/components/Web/Forms/FormError';
import Switch from '@/components/Common/Fields/Switch';

import { CreateFishbowlOptions, UpdateFishbowlOptions } from '@/types/graphql/fishbowl';
import { Fishbowl } from '@/types/api-platform/interfaces/fishbowl';

interface FormProps {
  required: string;
  date: string;
  title: string;
  createFishbowl: (
    options?: CreateFishbowlOptions
  ) => Promise<FetchResult<unknown, Record<string, unknown>, Record<string, unknown>>>;
  updateFishbowl: (
    options?: UpdateFishbowlOptions
  ) => Promise<FetchResult<unknown, Record<string, unknown>, Record<string, unknown>>>;
  onSubmit: (any) => void;
  currentLanguage: string;
  enableReinitialize?: boolean;
  selectedFishbowl?: FormValues | null;
  isFull?: boolean;
  isEditForm?: boolean;
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
}

const initialValues = {
  title: '',
  day: new Date(),
  time: nearestQuarterHour(),
  hours: '01:00',
  description: '',
  language: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  hasIntroduction: false
};

const Form = (props: FormProps & FormikProps<FormValues>) => {
  const { isSubmitting } = props;
  const { t } = useTranslation('form');
  const timezones = countriesAndTimezones.getAllTimezones();
  const { user } = useAuth();

  const selectedTime = () => {
    if (props.selectedFishbowl) {
      console.log(
        props.selectedFishbowl.time.toLocaleString('es', {
          timeZone: props.selectedFishbowl.timezone
        })
      );
      return props.selectedFishbowl.time.toLocaleString('es', {
        timeZone: props.selectedFishbowl.timezone
      });
    } else {
      return nearestQuarterHour();
    }
  };

  return (
    <FormikForm $isFull={props.isFull}>
      <fieldset className="fieldset-inline">
        <Input
          data-testid="edit-form-title"
          placeholder={t('defaultTitle', { name: user.name ? user.name.split(' ')[0] : '' })}
          label={t('fishbowl.title')}
          name="title"
          type="text"
          autoComplete="off"
        />
        <Textarea
          data-testid="edit-form-description"
          label={t('fishbowl.description')}
          name="description"
          validation={false}
          autoComplete="off"
        />
        <DatePicker
          data-testid="edit-form-date"
          label={t('fishbowl.day')}
          placeholderText={t('fishbowl.selectDay')}
          name="day"
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
              components={{ strong: <strong /> }}
            />
          }
          label={t('fishbowl.introductionLabel')}
          name="hasIntroduction"
        />
      </fieldset>
      <fieldset>
        <SubmitBtn
          data-testid='fishbowl-submit'
          text={props.selectedFishbowl ? t('button.modifyFishbowl') : t('button.createFishbowl')}
          disabled={isSubmitting}
        />
      </fieldset>
    </FormikForm>
  );
};

const FormValidation = withFormik<FormProps, FormValues>({
  mapPropsToValues: props => ({
    ...(props.selectedFishbowl ? props.selectedFishbowl : initialValues),
    language: props.currentLanguage
  }),
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
      timezone: Yup.string().required(props.required)
    });
  },
  handleSubmit: async (values, { props, setSubmitting }) => {
    const dayFormatted = formatDateTime(values.day);
    const timeFormatted = formatDateTime(values.time);

    if (props.isEditForm) {
      await props
        .updateFishbowl({
          variables: {
            input: {
              id: `/fishbowls/${values.id}`,
              name: values.title,
              description: values.description,
              startDateTime: `${dayFormatted.date} ${timeFormatted.time}`,
              timezone: values.timezone,
              duration: values.hours,
              locale: values.language,
              isFishbowlNow: false,
              hasIntroduction: values.hasIntroduction
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
              hasIntroduction: values.hasIntroduction
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
  selectedFishbowl = null,
  $isFull = false,
  isEditForm = false
}: {
  selectedFishbowl: Fishbowl;
  $isFull?: boolean;
  isEditForm: boolean;
}) => {
  const [error, setError] = useState(null);
  const router = useRouter();
  const [createFishbowl] = useMutation(CREATE_FISHBOWL);
  const [updateFishbowl] = useMutation(UPDATE_FISHBOWL);
  const { t, lang } = useTranslation('form');
  const { updateCreateFishbowl } = useAuth();

  const requiredError = t('validation.required');
  const dateError = t('validation.date');
  const titleError = t('validation.title');

  const handleOnSubmit = res => {
    if (res.type === 'Error') {
      console.error('[STOOA]', res);
      setError(res.data);
    } else {
      if (isEditForm) {
        console.log('SHEEEEEESH');
      } else {
        const {
          data: {
            createFishbowl: { fishbowl }
          }
        } = res;

        const route = `${ROUTE_FISHBOWL_DETAIL}/${fishbowl.slug}`;
        updateCreateFishbowl(true);
        router.push(route, route, { locale: lang });
      }
    }
  };

  let selectedFishbowlValues: FormValues;

  if (selectedFishbowl) {
    const stringDate = selectedFishbowl.startDateTimeTz.toString();
    const timezone = stringDate.substring(stringDate.length - 5, stringDate.length - 3);
    const sign = stringDate.substring(stringDate.length - 6, stringDate.length - 1);
    const hoursInMs = parseInt(timezone) * 60 * 60 * 1000;

    const timestamp = new Date(selectedFishbowl.startDateTimeTz).getTime();
    const UTCDate = new Date(new Date(timestamp + (sign === '-' ? -hoursInMs : hoursInMs)));
    const userTimezone = UTCDate.getTimezoneOffset() * 60000;
    const newDate = new Date(UTCDate.getTime() + userTimezone);

    console.log(newDate);

    selectedFishbowlValues = {
      id: selectedFishbowl.id,
      title: selectedFishbowl.name,
      day: newDate,
      time: newDate,
      hours: selectedFishbowl.durationFormatted,
      description: selectedFishbowl.description,
      language: selectedFishbowl.locale,
      timezone: selectedFishbowl.timezone,
      hasIntroduction: false
    };
  }

  return (
    <>
      {error && <FormError errors={error} />}
      <FormValidation
        isFull={$isFull}
        title={titleError}
        enableReinitialize
        required={requiredError}
        date={dateError}
        createFishbowl={createFishbowl}
        updateFishbowl={updateFishbowl}
        onSubmit={handleOnSubmit}
        currentLanguage={lang}
        selectedFishbowl={selectedFishbowlValues ? selectedFishbowlValues : null}
        isEditForm={isEditForm}
      />
    </>
  );
};

export default FishbowlForm;
