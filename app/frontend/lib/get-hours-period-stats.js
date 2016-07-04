import utils from "~lib/utils"
import _ from "underscore"

const MS_PER_HOUR = 1000 * 60 * 60;

function convertMsToHours(ms){
    var hours = ms / MS_PER_HOUR;
    return utils.round(hours, 2);
}

function getDateWithSecondsSetToZero(date){
    date = new Date(date);
    date.setSeconds(0)
    return date;
}

function getSingleHoursPeriodStats({denormalizedHoursPeriod}){
    if (denormalizedHoursPeriod.ends_at === null){
        return {
            hours: 0,
            breaks: 0
        }
    }

    var ends_at = getDateWithSecondsSetToZero(denormalizedHoursPeriod.ends_at);
    var starts_at = getDateWithSecondsSetToZero(denormalizedHoursPeriod.starts_at);
    var msTotalLength = ends_at - starts_at;
    var msBreakLength = 0;

    var breakObjects = denormalizedHoursPeriod.breaks;
    breakObjects.forEach(function(breakItem){
        var ends_at = getDateWithSecondsSetToZero(breakItem.ends_at);
        var starts_at = getDateWithSecondsSetToZero(breakItem.starts_at)
        msBreakLength += ends_at - starts_at
    });

    var msHoursLength = msTotalLength - msBreakLength;

    return {
        hours: convertMsToHours(msHoursLength),
        breaks: convertMsToHours(msBreakLength)
    }
}

export default function getHoursPeriodStats({denormalizedHoursPeriods}){
    if (!_.isArray(denormalizedHoursPeriods)) {
        denormalizedHoursPeriods = [denormalizedHoursPeriods]
    }

    var total = {
        hours: 0,
        breaks: 0
    }

    denormalizedHoursPeriods.forEach(function(denormalizedHoursPeriod){
        var singleStats = getSingleHoursPeriodStats({denormalizedHoursPeriod});
        total.hours += singleStats.hours;
        total.breaks += singleStats.breaks;
    });

    return {
        hours: utils.round(total.hours, 2),
        breaks: utils.round(total.hours, 2)
    }
}
