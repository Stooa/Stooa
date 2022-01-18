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
import { withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';
import countriesAndTimezones from 'countries-and-timezones';

import { ROUTE_FISHBOWL_DETAIL } from '@/app.config';
import { locales } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { CREATE_FISHBOWL } from '@/lib/gql/Fishbowl';
import { formatDateTime, nearestQuarterHour } from '@/lib/helpers';
import FormikForm from '@/ui/Form';
import Input from '@/components/Common/Fields/Input';
import Textarea from '@/components/Common/Fields/Textarea';
import Select from '@/components/Common/Fields/Select';
import DatePicker from '@/components/Common/Fields/DatePicker';
import SubmitBtn from '@/components/Web/SubmitBtn';
import FormError from '@/components/Web/Forms/FormError';

type createFishbowlAttrs = {
  variables: {
    input: {
      name: string;
      description: string;
      startDateTime: string;
      timezone: string;
      duration: string;
      locale: string;
    };
  };
};

interface FormProps {
  required: string;
  date: string;
  title: string;
  createFishbowl: (
    options?: createFishbowlAttrs
  ) => Promise<FetchResult<unknown, Record<string, unknown>, Record<string, unknown>>>;
  onSubmit: (any) => void;
  currentLanguage: string;
  currentTimezone: string;
  enableReinitialize?: boolean;
  selectedFishbowl?: FormValues | null;
  full: boolean;
  defaultHourValue: string;
  defaultTime: Date;
}

interface FormValues {
  title: string;
  day: Date;
  time: Date;
  hours: string;
  description: string;
  language: string;
  timezone: string;
}

const initialValues = {
  title: '',
  day: new Date(),
  time: '',
  hours: '',
  description: '',
  language: '',
  timezone: ''
};

const Form = (props: FormProps & FormikProps<FormValues>) => {
  const { isSubmitting } = props;
  const { t } = useTranslation('form');
  const timezones = countriesAndTimezones.getAllTimezones();
  const { user } = useAuth();

  return (
    <FormikForm full={props.full ? props.full : undefined}>
      <fieldset className="fieldset-inline">
        <Input
          placeholder={t('defaultTitle', { name: user.name ? user.name.split(' ')[0] : ''})}
          label={t('fishbowl.topic')}
          name="title"
          type="text"
          autoComplete="off"
        />
        <Textarea
          label={t('fishbowl.description')}
          name="description"
          validation={false}
          autoComplete="off"
        />
        <DatePicker
          label={t('fishbowl.day')}
          placeholderText={t('fishbowl.selectDay')}
          name="day"
          minDate={new Date()}
          dateFormat="dd/MM/yyyy"
          icon="calendar"
          autoComplete="off"
        />
        <DatePicker
          label={t('fishbowl.time')}
          placeholderText={t('fishbowl.selectTime')}
          name="time"
          showTimeSelect
          showTimeSelectOnly
          selected={nearestQuarterHour()}
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
          autoComplete="off">
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
                value={time}>{`${time} ${t('fishbowl.hours')}`}</option>
            );
          })}
        </Select>
        <Select label={t('fishbowl.timezone')} name="timezone" icon="world" autoComplete="off">
          <option value="">{t('fishbowl.selectTimeZone')}</option>
          {/* TODO: NORMALIZE TIMEZONE VALUES */}
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
          label={t('fishbowl.selectLanguage')}
          name="language"
          icon="language"
          autoComplete="off">
          <option value="">{t('fishbowl.selectLanguage')}</option>
          {locales.map(locale => (
            <option value={locale} key={`locale-${locale}`}>
              {t(`common:languages.${locale}`)}
            </option>
          ))}
        </Select>
      </fieldset>
      <fieldset>
        <SubmitBtn
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
    language: props.currentLanguage,
    timezone: props.currentTimezone,
    hours: props.defaultHourValue,
    time: props.defaultTime
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
    await props
      .createFishbowl({
        variables: {
          input: {
            name: values.title,
            description: values.description,
            startDateTime: `${dayFormatted.date} ${timeFormatted.time}`,
            timezone: values.timezone,
            duration: values.hours,
            locale: values.language
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
})(Form);

const CreateFishbowl = ({ selectedFishbowl = null, full = false }) => {
  const [error, setError] = useState(null);
  const router = useRouter();
  const [createFishbowl] = useMutation(CREATE_FISHBOWL);
  const { t, lang } = useTranslation('form');
  const { updateCreateFishbowl } = useAuth();

  const requiredError = t('validation.required');
  const dateError = t('validation.date');
  const titleError = t('validation.title');

  const currentUserTimezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleOnSubmit = res => {
    if (res.type === 'Error') {
      console.error('[STOOA]', res);
      setError(res.data);
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
  };

  let selectedFishbowlValues: FormValues;

  if (selectedFishbowl) {
    const { timezone } = formatDateTime(selectedFishbowl.startDateTimeTz);

    selectedFishbowlValues = {
      title: selectedFishbowl.name,
      day: new Date(selectedFishbowl.startDateTimeTz),
      time: selectedFishbowl.startDateTimeTz,
      hours: selectedFishbowl.durationFormatted,
      description: selectedFishbowl.description,
      language: selectedFishbowl.locale,
      timezone: timezone
    };
  }

  return (
    <>
      {error && <FormError errors={error} />}
      <FormValidation
        full={full}
        title={titleError}
        enableReinitialize
        required={requiredError}
        date={dateError}
        createFishbowl={createFishbowl}
        onSubmit={handleOnSubmit}
        defaultTime={nearestQuarterHour()}
        defaultHourValue="01:00"
        currentLanguage={lang}
        currentTimezone={currentUserTimezoneName}
        selectedFishbowl={selectedFishbowlValues ? selectedFishbowlValues : null}
      />
    </>
  );
};

export default CreateFishbowl;
