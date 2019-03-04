/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

self.importScripts('common.js', 'date-time-util.js', 'lib/bitset.min.js');

// Returns the number of workday hours for a given set of workday parameters, start/end
// timestamps, and an array of workdays (0 = Sunday).
//
// The function creates bit sets representing individual minutes of a calendar day,
// every working minute is represented by 1 in the sets.
// The function performs boolean AND on the bitsets to find intersections and calculates
// the number of bits set to 1 that represent workday minutes.
const elapsedTime = (data) => {
  const {
    workdays,
    workday,
    startDate,
    startTime,
    endDate,
    endTime,
  } = data;

  const {
    start,
    end,
    lbStart,
    lbEnd,
  } = workday;

  function isWorkday(ms) {
    return workdays.includes(getDayOfWeek(new Date(ms)));
  }

  let startDateTime = getDateTimeFromDateStrTimeStr(startDate, startTime);
  let endDateTime = getDateTimeFromDateStrTimeStr(endDate, endTime);
  const swapTimes = startDateTime > endDateTime;
  if (swapTimes) {
    [startDateTime, endDateTime] = [endDateTime, startDateTime];
  }

  const startDayStart = getDayStart(startDateTime);
  const endDayStart = getDayStart(endDateTime);

  const workStartMinutes = getMinutesFromDayStartTimeStr(start);
  const workEndMinutes = getMinutesFromDayStartTimeStr(end);
  const lunchBreakStartMinutes = getMinutesFromDayStartTimeStr(lbStart);
  const lunchBreakEndMinutes = getMinutesFromDayStartTimeStr(lbEnd);

  const startMinutes = getMinutes(startDateTime - startDayStart);
  const endMinutes = getMinutes(endDateTime - endDayStart);

  const fullDayBits = new BitSet(MINUTES_PER_DAY);
  const startDayBits = new BitSet(MINUTES_PER_DAY);
  const endDayBits = new BitSet(MINUTES_PER_DAY);

  fullDayBits.clear();
  fullDayBits.setRange(workStartMinutes, workEndMinutes - 1);
  fullDayBits.clear(lunchBreakStartMinutes, lunchBreakEndMinutes - 1);

  startDayBits.clear();
  startDayBits.setRange(startMinutes, MINUTES_PER_DAY - 1);

  endDayBits.clear();
  endDayBits.setRange(0, endMinutes - 1);

  let minutes = 0;

  if (startDayStart === endDayStart) {
    // Single day
    if (isWorkday(startDayStart)) {
      minutes += fullDayBits.and(startDayBits).and(endDayBits).cardinality();
      // test(minutes);
    }
  } else {
    // 2+ days

    // Day 1
    if (isWorkday(startDayStart)) {
      minutes += fullDayBits.and(startDayBits).cardinality();
      // test(minutes);
    }

    // Day 2 on
    let curDayStart = startDayStart + MSEC_PER_DAY;
    const fullDayMinutes = fullDayBits.cardinality();

    while (curDayStart < endDayStart) {
      if (isWorkday(curDayStart)) {
        minutes += fullDayMinutes;
        // test(minutes);
      }

      curDayStart += MSEC_PER_DAY;
    }

    // Day Z
    if (isWorkday(endDayStart)) {
      minutes += fullDayBits.and(endDayBits).cardinality();
      // test(minutes);
    }
  }

  const hours = minutes / MINUTES_PER_HOUR;
  return swapTimes ? -hours : hours;
};

self.onmessage = (msg) => {
  const numHours = elapsedTime(msg.data);
  self.postMessage({ type: TYPE_DATA, hours: numHours });
};
