import _ from "underscore"
import RotaDate from "~lib/rota-date"

const MINUTES_PER_DAY = 24 * 60;

export function _getSamplingTimeOffsetsForDay(granularityInMinutes){
    var samplingTimes = [];

    var lastSamplingTimeInMinutes = 0;
    while (lastSamplingTimeInMinutes <= MINUTES_PER_DAY) {
        samplingTimes.push(lastSamplingTimeInMinutes);

        lastSamplingTimeInMinutes += granularityInMinutes;
    }

    return samplingTimes;
}

/**
Processes a list of shifts and returns a list of shifts that are scheduled for each
time during the day.

Granularity determines how many intervals the breakdown is split into. For example, 
a granularity of 60 minutes means a day has 24 intervals.

When determining the shifts for each sampling point start time is inclusive and end
time is exclusive.
For example "2am to 4pm" would be matched for 2pm and 3pm, but not for 4pm.

The responsive consists of an array like this:
[{
    timeOffset: 60, // number of minutes since the start of the rota date at 8am
    date: Date(9am),
    shiftsByStaffType: {
        bar_back: [shift1, shift2],
        kitchen: [shift3]
    }
}, ...]

@param  {array} shifts - list of rota shifts for the day
@param  {array} staff - staff that the shifts belong to
@param  {number} granularityInMinutes - see above
@param  {object} staffTypes - staff types object mapping keys to title etc
@param  {object} rotaDate - rota date object for the day the shifts are on
@return {array} - see above
*/
export function getStaffTypeBreakdownByTime(options){
    var {shifts, staff, granularityInMinutes, staffTypes, rotaDate} = options;

    function getStaffTypeFromShift(shift) {
        return _(staff).find({id: shift.staff_id}).staff_type;
    }
    function getInitialBreakdownAtSamplingPoint(offsetInMinutes){
        var startTimeClone = new Date(rotaDate.startTime);
        var newMinutes = rotaDate.startTime.getMinutes() + offsetInMinutes;
        var date = new Date(startTimeClone.setMinutes(newMinutes));

        var obj = {
            shiftsByStaffType: {},
            timeOffset: offsetInMinutes,
            date
        };

        for (var staffType in staffTypes) {
            obj.shiftsByStaffType[staffType] = [];
        }
        return obj;
    }

    var samplingTimeOffsets = _getSamplingTimeOffsetsForDay(granularityInMinutes)
    var breakdown = samplingTimeOffsets.map(function(offset){
        return getInitialBreakdownAtSamplingPoint(offset)
    });

    if (shifts.length === 0) {
        return breakdown;
    }

    shifts.forEach(function(shift, i){
        var staffType = getStaffTypeFromShift(shift);
        breakdown.forEach(function(samplingPoint){
            var startsBeforeOrAtSamplingPoint = samplingPoint.date >= shift.starts_at;
            var endsAfterSamplingPoint = samplingPoint.date < shift.ends_at;
            var shiftCoversSamplingPoint =  startsBeforeOrAtSamplingPoint && endsAfterSamplingPoint;
            if (shiftCoversSamplingPoint) {
                samplingPoint.shiftsByStaffType[staffType].push(shift);
            }
        });
    });

    return breakdown;
}