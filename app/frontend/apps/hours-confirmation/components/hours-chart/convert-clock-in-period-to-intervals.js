import _ from "underscore"

export default function(clockInPeriod, clockInBreaks){
    var breaks = clockInPeriod.breaks.map(function(breakLink){
        return breakLink.get(clockInBreaks)
    })
    var breaksOrderedByStartTime = _.sortBy(breaks, "starts_at")

    var lastTime = clockInPeriod.starts_at;
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

    if (clockInPeriod.ends_at) {
        intervals.push({
            starts_at: lastTime,
            ends_at: clockInPeriod.ends_at,
            type: "hours"
        })
    }

    return intervals;
}
