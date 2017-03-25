import getSamplingTimeOffsetsForDay from "./get-sampling-time-offsets-for-day"
import moment from "moment"
import RotaDate from "./rota-date"
import _ from "underscore"

function  unmemoizedGetPossibleShiftTimes(intervalSizeInMinutes, rotaStartTime) {
    var minutesOffsets = getSamplingTimeOffsetsForDay(intervalSizeInMinutes);
    var possibleShiftStartTimeStrings = minutesOffsets.map(function(offset){
        let shiftedTime = new Date(rotaStartTime.valueOf() + (offset * 60 * 1000 ));
        return moment(shiftedTime).format("HH:mm");
    });
    var possibleShiftEndTimeStrings = _.clone(possibleShiftStartTimeStrings);

    possibleShiftStartTimeStrings.pop(); // remove 8am at the end
    possibleShiftEndTimeStrings.shift(); // remove 8am at the start

    return {
        startTimes: possibleShiftStartTimeStrings,
        endTimes: possibleShiftEndTimeStrings
    }
}

var getPossibleShiftTimes = _.memoize(unmemoizedGetPossibleShiftTimes);

export function getPossibleShiftStartTimeStrings(intervalSizeInMinutes, rotaStartTime) {
  return getPossibleShiftTimes(intervalSizeInMinutes, rotaStartTime).startTimes
}

export function getPossibleShiftEndTimeStrings(intervalSizeInMinutes, rotaStartTime)
{
    return getPossibleShiftTimes(intervalSizeInMinutes, rotaStartTime).endTimes
}
