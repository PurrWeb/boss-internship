import getSamplingTimeOffsetsForDay from "./get-sampling-time-offsets-for-day"
import moment from "moment"
import RotaDate from "./rota-date"
import _ from "underscore"

function unmemoizedGetPossibleShiftTimes(intervalSizeInMinutes) {
    var minutesOffsets = getSamplingTimeOffsetsForDay(intervalSizeInMinutes);
    var rotaDate = new RotaDate({dateOfRota: new Date()});
    var possibleShiftStartTimeStrings = minutesOffsets.map(function(offset){
        var time = new Date(rotaDate.startTime);
        time = new Date(time.valueOf() + (offset * 60 * 1000 ));
        return moment(time).format("HH:mm");
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

export function getPossibleShiftStartTimeStrings(intervalSizeInMinutes) {
    return getPossibleShiftTimes(intervalSizeInMinutes).startTimes
}

export function getPossibleShiftEndTimeStrings(intervalSizeInMinutes) {
    return getPossibleShiftTimes(intervalSizeInMinutes).endTimes
}
