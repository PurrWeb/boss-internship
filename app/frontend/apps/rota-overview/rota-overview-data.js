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

export function getStaffTypeBreakdownByTime(shifts, staff, granularityInMinutes, staffTypes){
    console.profile()
    function getStaffTypeFromShift(shift) {
        return _(staff).find({id: shift.staff_id}).staff_type;
    }
    function getInitialBreakdownAtSamplingPoint(){
        var obj = {};
        for (var staffType in staffTypes) {
            obj[staffType] = 0;
        }
        return obj;
    }

    

    var samplingTimeOffsets = _getSamplingTimeOffsetsForDay(granularityInMinutes)
    var breakdown = {};

    var initialBreakdownAtSamplingPoint = getInitialBreakdownAtSamplingPoint();
    samplingTimeOffsets.forEach(function(offset){
        breakdown[offset] = _.clone(initialBreakdownAtSamplingPoint);
    })

    if (shifts.length === 0) {
        return breakdown;
    }

    var rotaDate = new RotaDate(shifts[0].starts_at)

    var samplingOffsetsAndDates = samplingTimeOffsets.map(function(offset){
        var startTimeClone = new Date(rotaDate.startTime);
        var date = new Date(startTimeClone.setMinutes(rotaDate.startTime.getMinutes() + offset));
        return {
            offset, date
        };
    });

    shifts.forEach(function(shift, i){
        var staffType = getStaffTypeFromShift(shift);
        samplingOffsetsAndDates.forEach(function(samplingPoint){
            var shiftCoversSamplingPoint = samplingPoint.date >= shift.starts_at && samplingPoint.date <= shift.ends_at;
            breakdown[samplingPoint.offset][staffType] += shiftCoversSamplingPoint ? 1 : 0;
        })
    });

    console.profileEnd()

    return breakdown;
}