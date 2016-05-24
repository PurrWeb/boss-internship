import utils from "~lib/utils"
import _ from "underscore"

const MS_PER_HOUR = 1000 * 60 * 60;

function convertMsToHours(ms){
    var hours = ms / MS_PER_HOUR;
    return utils.round(hours, 2);
}

function getSingleHoursPeriodStats({hoursPeriod, clockInBreaks}){
    if (hoursPeriod.ends_at === null){
        return {
            hours: 0,
            breaks: 0
        }
    }

    var msTotalLength = hoursPeriod.ends_at - hoursPeriod.starts_at;
    var msBreakLength = 0;

    var breakObjects = hoursPeriod.breaks.map(b => b.get(clockInBreaks))
    breakObjects.forEach(function(breakItem){
        msBreakLength += breakItem.ends_at - breakItem.starts_at;
    });

    var msHoursLength = msTotalLength - msBreakLength;

    return {
        hours: convertMsToHours(msHoursLength),
        breaks: convertMsToHours(msBreakLength)
    }
}

export default function getHoursPeriodStats({hoursPeriods, clockInBreaks}){
    if (!_.isArray(hoursPeriods)) {
        hoursPeriods = [hoursPeriods]
    }

    var total = {
        hours: 0,
        breaks: 0
    }

    hoursPeriods.forEach(function(hoursPeriod){
        var singleStats = getSingleHoursPeriodStats({hoursPeriod, clockInBreaks});
        total.hours += singleStats.hours;
        total.breaks += singleStats.breaks;
    });

    return total;
}
