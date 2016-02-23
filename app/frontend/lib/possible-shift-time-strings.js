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
var possibleShiftEndTimeStrings = _.clone(possibleShiftStartTimeStrings);

possibleShiftStartTimeStrings.pop(); // remove 8am at the end
possibleShiftEndTimeStrings.shift(); // remove 8am at the start

export default {possibleShiftStartTimeStrings, possibleShiftEndTimeStrings};