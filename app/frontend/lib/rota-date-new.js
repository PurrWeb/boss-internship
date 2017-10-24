import SafeMoment from '~/lib/safe-moment';

const DAY_START_TIME = 8;
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
/**
 * A day that lasts from 8am till 8am the next day.
 */
class RotaDate {
    /**
     * @param  {Date} [shiftStartsAt] - Create a RotaDate based on the starts_at value of a shift.
     * @param  {Date} [dateOfRota] - Create a RotaDate based on the date value of a rota (based on the date at midnight).
     */
    constructor({shiftStartsAt, shiftEndsAt, dateOfRota}) {
        if (shiftStartsAt) {
            this.initUsingBaseDate(shiftStartsAt);
        } else if (shiftEndsAt) {
            var endTimeIs8am = shiftEndsAt.getHours() === 8 &&
                shiftEndsAt.getMinutes() === 0 &&
                shiftEndsAt.getSeconds() === 0;
            shiftStartsAt = shiftEndsAt
            if (endTimeIs8am){
                shiftStartsAt.setDate(shiftStartsAt.getDate() - 1);
            }
            this.initUsingBaseDate(shiftStartsAt)
        }
        else if (dateOfRota) {
            var baseDate = SafeMoment.uiDateParse(dateOfRota);
            baseDate.hours(12); // make sure baseDate time is actually on the rota day
            this.initUsingBaseDate(baseDate);
        } else {
            throw new Error("RotaDate needs shiftStartsAt or dateOfRota option.");
        }
    }
    // shiftStartsAt has to be on the actual rota day between 8am and 7:59am.
    // You can't pass in  a `shift.ends_at` value because 8am would count as the next day.
    // A `rota.date` value also can't be pased in directly because it's midnight on the previous rota day.
    initUsingBaseDate(baseDate){
        this.startTime = SafeMoment.uiDateParse(baseDate);
        if (baseDate.hours() < 8) {
            this.startTime.subtract(1, 'days');
        }
        this.startTime.hours(DAY_START_TIME).minutes(0).seconds(0);
        this.endTime = SafeMoment.uiDateParse(this.startTime);
        this.endTime.add(1, 'days');
    }
    /**
     * Returns a Date object with the specified time that's on the rota day.
     * (E.g. if the rota day is the 16th and you pass in 4am then the date
     * object is on the 17th)
     *
     * @param {Number} hours
     * @param {Number} minutes
     * @param {Boolean} isEndOfShift - to select whether 8:00 is at the end of
     * the date or at the beginning
     */
    _getDateAtTime(hours, minutes, isEndOfShift) {
        var result = new Date(this.startTime);
        var dateIsNextDay = hours < DAY_START_TIME;
        if (hours === DAY_START_TIME && minutes === 0) {
            if (isEndOfShift) {
                dateIsNextDay = true;
            }
        }

        if (dateIsNextDay) {
            result.setDate(result.getDate() + 1);
        }

        result.setHours(hours, minutes, 0, 0);
        return result;
    }
    getDateFromShiftStartTime(hours, minutes) {
        return this._getDateAtTime(hours, minutes, false);
    }
    getDateFromShiftEndTime(hours, minutes) {
        return this._getDateAtTime(hours, minutes, true);
    }
    _getDateAtTimeString(timeData, isEndOfShift) {
        var startOrEnd = isEndOfShift ? "End" : "Start";
        var [hours, minutes] = timeData.value.split(":").map(parseFloat);
        return this["getDateFromShift" + startOrEnd + "Time"](hours, minutes);
    }
    getDateFromShiftStartTimeString(timeString){
        return this._getDateAtTimeString(timeString, false);
    }
    getDateFromShiftEndTimeString(timeString){
        return this._getDateAtTimeString(timeString, true);
    }
    getHoursSinceStartOfDay(date){
        var msSinceStartOfDay =  date.valueOf() - this.startTime.valueOf();
        return msSinceStartOfDay / MILLISECONDS_PER_HOUR;
    }
    getDateOfRota(){
        var dateOfRota = new Date(this.startTime);
        dateOfRota.setHours(0);
        return dateOfRota;
    }
    getDateNHoursAfterStartTime(hours, minutes){
        var date = new Date(this.startTime);
        date.setHours(date.getHours() + hours);
        if (minutes !== undefined) {
            date.setMinutes(date.getMinutes() + minutes);
        }
        return date;
    }
}

export default RotaDate;
