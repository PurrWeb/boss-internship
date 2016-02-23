import getSamplingTimeOffsetsForDay from "./get-sampling-time-offsets-for-day"
import moment from "moment"
import RotaDate from "./rota-date"
import _ from "underscore"

var minutesOffsets = getSamplingTimeOffsetsForDay(30);
var rotaDate = new RotaDate({dateOfRota: new Date()});
var possibleShiftStartTimeStrings = minutesOffsets.map(function(offset){
    var time = new Date(rotaDate.startTime);
    time.setMinutes(time.getMinutes() + offset);
    return moment(time).format("HH:mm");
});

// First end time is 8:30, last end time 8:00
var possibleShiftEndTimeStrings = _.clone(possibleShiftStartTimeStrings);
var startOfDay = possibleShiftEndTimeStrings.shift(possibleShiftEndTimeStrings);
possibleShiftEndTimeStrings.push(startOfDay)

export default {possibleShiftStartTimeStrings, possibleShiftEndTimeStrings};