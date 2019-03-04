/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

self.importScripts('common.js', 'date-time-util.js', 'lib/bitset.min.js');

function mirrorBitSet(bitSet) {
  const arr = bitSet.toArray(); // arr contains indices of the set bits
  arr.forEach((value, index) => {
    // value of arr[index]: 0 -> MINUTES_PER_DAY - 1, MINUTES_PER_DAY - 1 -> 0
    arr[index] = (MINUTES_PER_DAY - 1) - value;
  });
  return new BitSet(arr);
}

// Determines when a given number of workday hours will end in the future.
// The function accepts a set of workday parameters, start timestamp, duration, and an
// array of workdays (0 = Sunday).
//
// The function creates bit sets representing individual minutes of a calendar day,
// every working minute is represented by 1 in the sets.
// The function performs boolean AND on the bitsets to find intersections and calculates
// the number of bits set to 1 that represent workday minutes.
const futureTime = (data) => {
  const {
    workdays,
    workday,
    startDate,
    startTime,
    duration,
  } = data;

  const {
    start,
    end,
    lbStart,
    lbEnd,
  } = workday;

  const backInTime = duration < 0;

  function isWorkday(ms) {
    return workdays.includes(getDayOfWeek(new Date(ms)));
  }

  const startDateTime = getDateTimeFromDateStrTimeStr(startDate, startTime);
  const startDayStart = getDayStart(startDateTime);

  const workStartMinutes = getMinutesFromDayStartTimeStr(start);
  const workEndMinutes = getMinutesFromDayStartTimeStr(end);
  const lunchBreakStartMinutes = getMinutesFromDayStartTimeStr(lbStart);
  const lunchBreakEndMinutes = getMinutesFromDayStartTimeStr(lbEnd);

  const startMinutes = getMinutes(startDateTime - startDayStart);

  const fullDayBits = new BitSet(MINUTES_PER_DAY);
  const startDayBits = new BitSet(MINUTES_PER_DAY);

  fullDayBits.clear();
  fullDayBits.setRange(workStartMinutes, workEndMinutes - 1);
  fullDayBits.clear(lunchBreakStartMinutes, lunchBreakEndMinutes - 1);

  startDayBits.clear();
  if (backInTime) {
    startDayBits.setRange(0, startMinutes - 1);
  } else {
    startDayBits.setRange(startMinutes, MINUTES_PER_DAY - 1);
  }

  let minutes = Math.round(Math.abs(duration) * MINUTES_PER_HOUR);
  let curDayStart = startDayStart;
  let endMilliseconds = startDateTime;

  function binarySearch(bitSet, val) {
    if (val === 0) return 0;

    let s = 0;
    let e = MINUTES_PER_DAY - 1;
    let index = -1;

    while (s <= e) {
      const mid = s + Math.floor((e - s) / 2); // as for repetitive values
      const curVal = bitSet.slice(0, mid).cardinality();

      if (curVal === val) {
        // The bit should be 1, otherwise we return the first minute from the 0 area
        // to the right we come across
        if (bitSet.get(mid) === 1) return mid;

        index = mid;
        e = mid - 1;
      } else if (val < curVal) {
        e = mid - 1;
      } else {
        s = mid + 1;
      }
    }

    return index;
  }

  function processDayMinutes(dayMinutesBitSet) {
    if (!isWorkday(curDayStart)) return true;

    const dayMinutes = dayMinutesBitSet.cardinality();
    if (minutes > dayMinutes) {
      // Use up the day minutes and proceed to the next day
      minutes -= dayMinutes;
      return true;
    }

    if (minutes === 0) { // 0 duration
      return false;
    }

    // The duration minutes are up on this day, determine when especially
    const endMinutes = minutes; // Number of workday minutes
    let endMin; // Position in the bit set where endMinutes are reached

    // Binary search on the bit set
    if (backInTime) {
      // Searching the endMinutes position from the end of the day
      endMin = binarySearch(mirrorBitSet(dayMinutesBitSet), endMinutes);
    } else {
      endMin = binarySearch(dayMinutesBitSet, endMinutes);
    }

    if (endMin === -1) { // not found
      self.postMessage({ type: TYPE_ERROR, err: ERROR_FUTURE_TIME_ALGORYTHM });
      return false;
    }

    if (backInTime) {
      endMin = (MINUTES_PER_DAY - 1) - endMin;
      endMilliseconds = curDayStart + endMin * MSEC_PER_MINUTE;
    } else {
      endMilliseconds = curDayStart + (endMin + 1) * MSEC_PER_MINUTE;
    }

    minutes = 0;
    return false;
  }

  // Day 1
  if (processDayMinutes(fullDayBits.and(startDayBits))) {
    if (backInTime) {
      curDayStart -= MSEC_PER_DAY;
    } else {
      curDayStart += MSEC_PER_DAY;
    }
  }

  // Day 2 on
  while (minutes > 0 && processDayMinutes(fullDayBits)) {
    if (backInTime) {
      curDayStart -= MSEC_PER_DAY;
    } else {
      curDayStart += MSEC_PER_DAY;
    }
  }

  return getUTCDate(new Date(endMilliseconds));
};

self.onmessage = (msg) => {
  const dt = futureTime(msg.data);
  self.postMessage({ type: TYPE_DATA, dateTime: dt });
};
