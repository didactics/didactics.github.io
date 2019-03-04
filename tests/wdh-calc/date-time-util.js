/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const MINUTES_PER_HOUR = 60;
const SEC_PER_MINUTE = 60;
const MINUTES_PER_DAY = MINUTES_PER_HOUR * 24;
const MSEC_PER_MINUTE = 1000 * SEC_PER_MINUTE;
const MSEC_PER_DAY = MSEC_PER_MINUTE * MINUTES_PER_DAY;

// '1' -> '01'
const addLeadingZero = val => (val < 10 ? `0${val}` : val);

// dateTime -> '2019-02-26'
const getDateStr = (dateTime) => {
  const dd = addLeadingZero(dateTime.getDate());
  const mm = addLeadingZero(dateTime.getMonth() + 1); // January is 0!
  const yyyy = dateTime.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
};

// dateTime -> '12:07'
const getTimeStr = (dateTime) => {
  const hh = addLeadingZero(dateTime.getHours());
  const min = addLeadingZero(dateTime.getMinutes());

  return `${hh}:${min}`;
};

// dateTime -> '02/26/2019', the browser locale
const getLocaleDateStr = dateTime => (dateTime ? dateTime.toLocaleDateString() : '?');

// dateTime -> '12:07 PM', the browser locale
const getLocaleTimeStr = dateTime => (
  dateTime ? dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '?');

// dateTime -> ms of midnight from 1970
const getDayStart = dateTime => (Math.floor(dateTime / MSEC_PER_DAY) * MSEC_PER_DAY);

// dateTime -> ms of next midnight from 1970
const getDayEnd = dateTime => (getDayStart(dateTime) + MSEC_PER_DAY - 1);

// dateTime -> ms from midnigh
const getTimeFromDayStart = dateTime => (dateTime - getDayStart(dateTime));

// dateTime -> ms to next midnigh
const getTimeToDayEnd = dateTime => (getDayEnd(dateTime) - dateTime);

// date ISO str ('2019-7-23') + time ISO str ('13:27') -> ms
const getDateTimeFromDateStrTimeStr = (dateIsoStr, timeIsoStr) => (
  Date.parse(`${dateIsoStr}T${timeIsoStr}Z`));

// time ISO str ('13:27') -> minutes from midnigh
const getMinutesFromDayStartTimeStr = timeIsoStr => (
  getDateTimeFromDateStrTimeStr('1970-01-01', timeIsoStr) / MSEC_PER_MINUTE);

// ms -> minutes
const getMinutes = ms => ms / MSEC_PER_MINUTE;

// dateTime -> day of week (0 = Sunday)
const getDayOfWeek = dateTime => dateTime.getDay();

// dateTime -> UTC dateTime
// removing the ' GMT' part from the end of the formatted string
const getUTCDate = dateTime => new Date(dateTime.toUTCString().slice(0, -4));
