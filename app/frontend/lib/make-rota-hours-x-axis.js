import d3 from "d3"

export default function(xScale, hoursNotShown){
    if (hoursNotShown === undefined) {
        hoursNotShown = 0;
    }

    var xAxis = d3.svg.axis();
    xAxis.scale(xScale);
    xAxis.ticks(24 - hoursNotShown)
    xAxis.tickSize(-100000) // draw lines across the whole chart for each tick
    xAxis.tickFormat(function(offset){
        var hours = offset + 8;
        if (hours > 23) {
            hours -= 24;
        }
        return hours
    })
    return xAxis;
}