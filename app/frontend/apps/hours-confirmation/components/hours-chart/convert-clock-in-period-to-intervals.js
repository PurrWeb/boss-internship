import _ from "underscore"

export default function(denormalizedHoursPeriod){
    var breaksOrderedByStartTime = _.sortBy(denormalizedHoursPeriod.breaks, "starts_at")

    var lastTime = denormalizedHoursPeriod.starts_at;
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

    if (denormalizedHoursPeriod.ends_at) {
        intervals.push({
            starts_at: lastTime,
            ends_at: denormalizedHoursPeriod.ends_at,
            type: "hours"
        })
    }

    return intervals;
}
