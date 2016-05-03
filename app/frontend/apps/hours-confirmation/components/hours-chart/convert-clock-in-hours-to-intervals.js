import _ from "underscore"

export default function(clockInHours){
    var breaksOrderedByStartTime = _.sortBy(clockInHours.breaks, "starts_at")

    var lastTime = clockInHours.starts_at;
    var intervals = [];

    breaksOrderedByStartTime.forEach(function(breakItem){
        intervals.push({
            starts_at: lastTime,
            ends_at: breakItem.starts_at,
            type: "hours"
        })
        if (breakItem.ends_at) {
            intervals.push({
                starts_at: breakItem.starts_at,
                ends_at: breakItem.ends_at,
                type: "break"
            })
            lastTime = breakItem.ends_at
        }
    })

    if (clockInHours.ends_at) {
        intervals.push({
            starts_at: lastTime,
            ends_at: clockInHours.ends_at,
            type: "hours"
        })
    }

    return intervals;
}
