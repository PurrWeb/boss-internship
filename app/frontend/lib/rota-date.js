const DAY_START_TIME = 8;
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
/**
 * A day that lasts from 8am till 8am the next day.
 */
class RotaDate {
    /**
     * @param  {Date} baseDate
     * (8am is always the current day, so don't create a RotaDate based on an ends_at value that might be 8am the next day.)
     */
    constructor(baseDate) {
        this.startTime = new Date(baseDate);
        if (baseDate.getHours() < 8) {
            this.startTime.setDate(baseDate.getDate() - 1);
        }
        this.startTime.setHours(DAY_START_TIME, 0, 0, 0);

        this.endTime = new Date(this.startTime);
        this.endTime.setDate(this.endTime.getDate() + 1);
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
    _getDateAtTimeString(timeString, isEndOfShift) {
        var startOrEnd = isEndOfShift ? "End" : "Start";
        var [hours, minutes] = timeString.split(":").map(parseFloat);
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

}

export default RotaDate;
