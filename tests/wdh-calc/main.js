/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable no-console */

window.app = new Vue({
  el: '#app',

  data: {
    workStartTime: '08:00',
    workEndTime: '17:00',
    lunchBreakStartTime: '11:30',
    lunchBreakEndTime: '12:30',

    elapsedStartDate: '',
    elapsedStartTime: '',
    elapsedEndDate: '',
    elapsedEndTime: '',

    futureStartDate: '',
    futureStartTime: '',
    futureDuration: '0.00',

    daysOfWeek: [
      { text: 'Sunday', value: 0 },
      { text: 'Monday', value: 1 },
      { text: 'Tuesday', value: 2 },
      { text: 'Wednesday', value: 3 },
      { text: 'Thursday', value: 4 },
      { text: 'Friday', value: 5 },
      { text: 'Saturday', value: 6 },
    ],

    daysSelected: [1, 2, 3, 4, 5],

    elapsedWorkdayHours: '0.00',
    futureEndDate: '',
    futureEndTime: '',

    elapsedTimeWorker: new Worker('elapsed-time.js'),

    // Make sure the worker processes the latest UI update
    elapsedTimeWorkerBusy: false, // the worker hasn't finised processing the last call
    elapsedTimeWorkerPendingCall: false, // a new call arrived while the worker was busy

    futureTimeWorker: new Worker('future-time.js'),

    // Make sure the worker processes the latest UI update
    futureTimeWorkerBusy: false, // the worker hasn't finised processing the last call
    futureTimeWorkerPendingCall: false, // a new call arrived while the worker was busy

    err: '',

  }, // data

  methods: {

    formatHours(num) {
      return num.toLocaleString(
        [], { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      );
    },

    formatHoursSt(st) {
      return Number.parseFloat(st).toFixed(2);
    },

    checkInputs() {
      this.err = '';

      if (!Array.isArray(this.daysSelected) || !this.daysSelected.length) {
        this.err = 'Seems no one is going to work this week (no days are selected on the Workday schedule).';
        return false;
      }

      const workStartTime = getMinutesFromDayStartTimeStr(this.workStartTime);
      const workEndTime = getMinutesFromDayStartTimeStr(this.workEndTime);
      const lunchBreakStartTime = getMinutesFromDayStartTimeStr(this.lunchBreakStartTime);
      const lunchBreakEndTime = getMinutesFromDayStartTimeStr(this.lunchBreakEndTime);

      if (workStartTime === workEndTime) {
        this.err = 'Seems no one is going to work (start time equals end time on the Workday schedule).';
        return false;
      }

      if (workStartTime > workEndTime) {
        this.err = 'Start time is greater than end time (Workday schedule).';
        return false;
      }

      if (lunchBreakStartTime > lunchBreakEndTime) {
        this.err = 'Lunch break start time is greater than end time (Workday schedule).';
        return false;
      }

      if (lunchBreakStartTime > workEndTime) {
        this.err = 'Lunch break start time is greater than workday end time (Workday schedule).';
        return false;
      }

      if (lunchBreakStartTime < workStartTime) {
        this.err = 'Lunch break starts before the workday (Workday schedule).';
        return false;
      }

      if (lunchBreakEndTime < workStartTime) {
        this.err = 'Lunch break ends before the workday (Workday schedule).';
        return false;
      }

      if (lunchBreakStartTime > workEndTime) {
        this.err = 'Lunch break starts after the workday (Workday schedule).';
        return false;
      }

      if (lunchBreakEndTime > workEndTime) {
        this.err = 'Lunch break ends after the workday (Workday schedule).';
        return false;
      }

      // const startDateTime = getDateTimeFromDateStrTimeStr(this.elapsedStartDate,
      //   this.elapsedStartTime);
      // const endDateTime = getDateTimeFromDateStrTimeStr(this.elapsedEndDate,
      //   this.elapsedEndTime);
      //
      // if (startDateTime > endDateTime) {
      //   this.err = 'Start date/time is greater than end date/time (Elapsed time).';
      //   return false;
      // }

      return true;
    },

    errorHandler(e) {
      const { lineno, filename, message } = e;
      this.err = `${message} (${filename}:${lineno})`;
    },

    updateElapsedTime() {
      if (!this.checkInputs()) return;
      if (this.elapsedTimeWorkerBusy) {
        this.elapsedTimeWorkerPendingCall = true;
        return;
      }
      this.elapsedTimeWorkerBusy = true;
      this.err = '';

      this.elapsedTimeWorker.postMessage({
        workdays: this.daysSelected, // []
        workday: {
          start: this.workStartTime,
          end: this.workEndTime,
          lbStart: this.lunchBreakStartTime,
          lbEnd: this.lunchBreakEndTime,
        },
        startDate: this.elapsedStartDate,
        startTime: this.elapsedStartTime,
        endDate: this.elapsedEndDate,
        endTime: this.elapsedEndTime,
      });
    },

    updateFutureTime() {
      if (!this.checkInputs()) return;
      if (this.futureTimeWorkerBusy) {
        this.futureTimeWorkerPendingCall = true;
        return;
      }
      this.futureTimeWorkerBusy = true;
      this.err = '';

      this.futureTimeWorker.postMessage({
        workdays: this.daysSelected, // []
        workday: {
          start: this.workStartTime,
          end: this.workEndTime,
          lbStart: this.lunchBreakStartTime,
          lbEnd: this.lunchBreakEndTime,
        },
        startDate: this.futureStartDate,
        startTime: this.futureStartTime,
        duration: this.futureDuration,
      });
    },

    updateAll() {
      this.updateElapsedTime();
      this.updateFutureTime();
    },
  }, // methods

  computed: {
  }, // computed

  watch: {
  },

  // Lifespan hooks
  mounted() {
    const now = new Date();

    this.elapsedStartDate = getDateStr(now);
    this.elapsedEndDate = this.elapsedStartDate;
    this.futureStartDate = this.elapsedStartDate;

    this.elapsedStartTime = getTimeStr(now);
    this.elapsedEndTime = this.elapsedStartTime;
    this.futureStartTime = this.elapsedStartTime;

    this.futureEndDate = getLocaleDateStr(now);
    this.futureEndTime = getLocaleTimeStr(now);

    // // Test
    // this.elapsedStartTime = '10:00';
    // this.elapsedEndTime = '11:00';


    this.elapsedTimeWorker.onmessage = (e) => {
      const { type, err, hours } = e.data;

      this.elapsedTimeWorkerBusy = false;

      if (this.elapsedTimeWorkerPendingCall) {
        this.elapsedTimeWorkerPendingCall = false;
        this.updateElapsedTime();
      }

      switch (type) {
        case TYPE_DATA:
          // this.elapsedWorkdayHours = hours.toFixed(2);
          this.err = '';
          this.elapsedWorkdayHours = this.formatHours(hours);
          break;

        case TYPE_ERROR:
          this.err = err;
          break;

        default:
      }
    };

    this.futureTimeWorker.onmessage = (e) => {
      const { type, err, dateTime } = e.data;

      this.futureTimeWorkerBusy = false;

      if (this.futureTimeWorkerPendingCall) {
        this.futureTimeWorkerPendingCall = false;
        this.updateFutureTime();
      }

      switch (type) {
        case TYPE_DATA:
          this.futureEndDate = getLocaleDateStr(dateTime);
          this.futureEndTime = getLocaleTimeStr(dateTime);
          break;

        case TYPE_ERROR:
          switch (err) {
            case ERROR_FUTURE_TIME_ALGORYTHM:
              this.err = 'Failed finding future date/time, algorythm error (Future date/time)';
              break;

            default:
          }

          break;

        default:
      }
    };

    this.elapsedTimeWorker.onerror = e => this.errorHandler(e);
    this.futureTimeWorker.onerror = e => this.errorHandler(e);

    this.updateAll();
  },

});
