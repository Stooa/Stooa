/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const getBackendSafeRoomName = room => {
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

const dispatchEvent = (eventName, detail = {}, element = window) => {
  const event = new CustomEvent(eventName, { detail });
  element.dispatchEvent(event);
};

const getTimeZoneName = date => {
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

const formatDateTime = date => {
  const d = new Date(date);

  let month = d.getMonth() + 1;
  let day = d.getDate();
  let year = d.getFullYear();
  let hour = d.getHours();
  let minutes = d.getMinutes();

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

const dateDifferenceFromNow = date => {
  const d = new Date(date);
  const now = new Date();
  return d.getTime() - now.getTime();
};

const isTimeLessThanNMinutes = (date, minutes = 1) => {
  const TIME = minutes * 60 * 1000;
  const t = dateDifferenceFromNow(date);

  return t <= TIME;
};

const isTimeUp = date => {
  return dateDifferenceFromNow(date) < 0;
};

const parseDevices = devices => {
  const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');
  const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
  const videoDevices = devices.filter(device => device.kind === 'videoinput');

  return { audioOutputDevices, audioInputDevices, videoDevices };
};

const nearestQuarterHour = () => {
  const quarter = 15 * 60 * 1000;
  return new Date(Math.ceil(new Date().getTime() / quarter) * quarter);
};

export {
  dateDifferenceFromNow,
  dispatchEvent,
  formatDateTime,
  getBackendSafeRoomName,
  isTimeLessThanNMinutes,
  isTimeUp,
  parseDevices,
  removeItem,
  nearestQuarterHour
};
