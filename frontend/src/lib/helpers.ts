/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const getBackendSafeRoomName = (room: string) => {
  if (!room) return room;

  try {
    room = decodeURIComponent(room);
  } catch (e) {}

  room = room.normalize('NFKC').toLowerCase();
  room = encodeURIComponent(room);

  return room.toLowerCase();
};

const removeItem = (arr, x) => {
  const index = arr.indexOf(x);
  if (index >= 0) arr.splice(index, 1);

  return arr;
};

const dispatchEvent = (eventName: string, detail = {}, element = window) => {
  const event = new CustomEvent(eventName, { detail });
  element.dispatchEvent(event);
};

const getTimeZoneName = (date: Date) => {
  const shortDate = date.toLocaleDateString();
  const fullDate = date.toLocaleDateString(undefined, { timeZoneName: 'short' });
  const shortIndex = fullDate.indexOf(shortDate);

  if (shortIndex >= 0) {
    return (
      fullDate.substring(0, shortIndex) +
      fullDate.substring(shortIndex + shortDate.length).replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '')
    );
  } else {
    return fullDate;
  }
};

const formatDateTime = (date: string | Date) => {
  const d = new Date(date);

  let month = (d.getMonth() + 1).toString();
  let day = d.getDate().toString();
  const year = d.getFullYear().toString();
  let hour = d.getHours().toString();
  let minutes = d.getMinutes().toString();

  if (month.toString().length < 2) month = `0${month}`;
  if (day.toString().length < 2) day = `0${day}`;
  if (hour.toString().length < 2) hour = `0${hour}`;
  if (minutes.toString().length < 2) minutes = `0${minutes}`;

  return {
    month,
    day,
    year,
    date: [year, month, day].join('-'),
    time: [hour, minutes].join(':'),
    timezone: getTimeZoneName(d)
  };
};

/**
 * Return list of months
 * 🌍 localeName   : name of local, f.e. es-ES, default en-US
 *  ✅ monthFormat : short, numeric, long (Default)
 */
function getMonthsForLocale(
  localeName = 'en-US',
  monthFormat: 'short' | 'long' | 'numeric' | '2-digit' | 'narrow' = 'long'
) {
  const format = new Intl.DateTimeFormat(localeName, { month: monthFormat }).format;
  return Array.from(Array(12).keys()).map(m => format(new Date(Date.UTC(2022, m))));
}

const dateDifferenceFromNow = (date: Date | string) => {
  const d = new Date(date);
  const now = new Date();
  return d.getTime() - now.getTime();
};

const isTimeLessThanNMinutes = (date: Date | string, minutes = 1) => {
  const TIME = minutes * 60 * 1000;
  const t = dateDifferenceFromNow(date);

  return t <= TIME;
};

const isTimeLessThanNSeconds = (date: Date | string, seconds = 1) => {
  const TIME = seconds * -1000;
  const t = dateDifferenceFromNow(date);
  return TIME < t;
};

const isTimeUp = (date: Date | string) => {
  return dateDifferenceFromNow(date) < 0;
};

const parseDevices = (devices: MediaDeviceInfo[]) => {
  const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');
  const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
  const videoDevices = devices.filter(device => device.kind === 'videoinput');

  return { audioOutputDevices, audioInputDevices, videoDevices };
};

const nearestQuarterHour = () => {
  const quarter = 15 * 60 * 1000;
  return new Date(Math.ceil(new Date().getTime() / quarter) * quarter);
};

const getTimePlusOneMinute = () => {
  const date = new Date(Date.now() + 60 * 1000);

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
};

const getIsoDateTimeWithActualTimeZone = () => {
  // FIXME: This is not working as expected.
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
};

const convertIntoClassName = text => {
  return text.replace(/\s/g, '-');
};

const supportsCaptureHandle = (): boolean => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Boolean(navigator.mediaDevices.setCaptureHandleConfig);
};

export {
  dateDifferenceFromNow,
  dispatchEvent,
  formatDateTime,
  getBackendSafeRoomName,
  isTimeLessThanNMinutes,
  isTimeLessThanNSeconds,
  isTimeUp,
  parseDevices,
  removeItem,
  getMonthsForLocale,
  nearestQuarterHour,
  getTimePlusOneMinute,
  getIsoDateTimeWithActualTimeZone,
  convertIntoClassName,
  supportsCaptureHandle
};
