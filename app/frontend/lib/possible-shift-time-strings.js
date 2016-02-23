import getSamplingTimeOffsetsForDay from "./get-sampling-time-offsets-for-day"
import moment from "moment"
import RotaDate from "./rota-date"

var minutesOffsets = getSamplingTimeOffsetsForDay(30);
var rotaDate = new RotaDate({dateOfRota: new Date()});
var possibleTimes = minutesOffsets.map(function(offset){
    var time = new Date(rotaDate.startTime);
    time.setMinutes(time.getMinutes() + offset);
    return moment(time).format("HH:mm");
});

export default possibleTimes;