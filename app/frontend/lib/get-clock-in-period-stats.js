import utils from "~lib/utils"
import _ from "underscore"

const MS_PER_HOUR = 1000 * 60 * 60;

function convertMsToHours(ms){
    var hours = ms / MS_PER_HOUR;
    return utils.round(hours, 2);
}

function getSingleClockInPeriodStats({clockInPeriod, clockInBreaks}){
    if (clockInPeriod.ends_at === null){
        return {
            hours: 0,
            breaks: 0
        }
    }

    var msTotalLength = clockInPeriod.ends_at - clockInPeriod.starts_at;
    var msBreakLength = 0;

    var breakObjects = clockInPeriod.breaks.map(b => b.get(clockInBreaks))
    breakObjects.forEach(function(breakItem){
        msBreakLength += breakItem.ends_at - breakItem.starts_at;
    });

    var msHoursLength = msTotalLength - msBreakLength;

    return {
        hours: convertMsToHours(msHoursLength),
        breaks: convertMsToHours(msBreakLength)
    }
}

export default function getClockInPeriodStats({clockInPeriods, clockInBreaks}){
    if (!_.isArray(clockInPeriods)) {
        clockInPeriods = [clockInPeriods]
    }

    var total = {
        hours: 0,
        breaks: 0
    }

    clockInPeriods.forEach(function(clockInPeriod){
        var singleStats = getSingleClockInPeriodStats({clockInPeriod, clockInBreaks});
        total.hours += singleStats.hours;
        total.breaks += singleStats.breaks;
    });

    return total;
}
