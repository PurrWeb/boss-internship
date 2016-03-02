import _ from "underscore"
import RotaDate from "~lib/rota-date"
import getSamplingTimeOffsetsForDay from "~lib/get-sampling-time-offsets-for-day"

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
    shiftsByGroup: {
        bar_back: [shift1, shift2],
        kitchen: [shift3]
    }
}, ...]

@param  {array} shifts - list of rota shifts for the day
@param  {array} staff - staff that the shifts belong to
@param  {number} granularityInMinutes - see above
@param  {object} groupsById - groups (e.g. stafftypes) with an id, name etc.
@param  {object} rotaDate - rota date object for the day the shifts are on
@return {array} - see above
*/
export default function getGroupedShiftBreakdownByTime(options){
    var {shifts, staff, granularityInMinutes, groupsById, rotaDate, getGroupFromShift} = options;

    function getInitialBreakdownAtSamplingPoint(offsetInMinutes){
        var startTimeClone = new Date(rotaDate.startTime);
        var newMinutes = rotaDate.startTime.getMinutes() + offsetInMinutes;
        var date = new Date(startTimeClone.setMinutes(newMinutes));

        var obj = {
            shiftsByGroup: {},
            timeOffset: offsetInMinutes,
            date
        };

        for (var groupId in groupsById) {
            obj.shiftsByGroup[groupId] = [];
        }
        return obj;
    }

    var samplingTimeOffsets = getSamplingTimeOffsetsForDay(granularityInMinutes)
    var breakdown = samplingTimeOffsets.map(function(offset){
        return getInitialBreakdownAtSamplingPoint(offset)
    });

    if (shifts.length === 0) {
        return breakdown;
    }

    shifts.forEach(function(shift, i){
        var groupId = getGroupFromShift(shift).id;
        
        breakdown.forEach(function(samplingPoint){
            var startsBeforeOrAtSamplingPoint = samplingPoint.date >= shift.starts_at;
            var endsAfterSamplingPoint = samplingPoint.date < shift.ends_at;
            var shiftCoversSamplingPoint =  startsBeforeOrAtSamplingPoint && endsAfterSamplingPoint;
            if (shiftCoversSamplingPoint) {
              samplingPoint.shiftsByGroup[groupId].push(shift);
            }
        });
    });

    return breakdown;
}