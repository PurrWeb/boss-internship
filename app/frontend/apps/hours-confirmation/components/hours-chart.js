import React from "react"
import d3 from "d3"
import RotaDate from "~lib/rota-date"
import makeRotaHoursXAxis from "~lib/make-rota-hours-x-axis"
import _ from "underscore"
import moment from "moment"

var innerWidth = 500;
var innerHeight = 60;
var padding = 20;
var barHeight = 40;
var outerWidth = innerWidth + padding * 2;
var outerHeight = innerHeight + padding * 2;

class HoursChartUi extends React.Component {
    render(){
        return <div className="hours-chart">
            <svg ref={(el) => this.el = el} />
        </div>
    }
    componentDidMount(){
        this.renderChart();
    }
    renderChart() {

        var chart = d3.select(this.el);
        chart.attr("width", outerWidth)
        chart.attr("height", outerHeight)

        var xScale = d3.scale.linear()
            .domain([0, 24])
            .range([0, innerWidth]);

        this.renderXAxis({chart, xScale})
        this.renderClockedIntervals({chart, xScale})
        this.renderRotaedIntervals({chart, xScale})
    }
    renderXAxis({chart, xScale}){
        var xAxis = makeRotaHoursXAxis(xScale);
         chart
            .append("g")
            .attr("transform", "translate(" + padding + "," + (innerHeight + padding) + ")")
            .attr("class", "axis")
            .call(xAxis);
    }
    renderRotaedIntervals({chart, xScale}){
        var rotaedMarkers = chart
            .append("g")
            .selectAll("g")
            .data(this.props.rotaedIntervals)
            .enter()
            .append("g")
            .attr("transform", function(interval){
                var x = xScale(interval.startOffsetInHours) + padding;
                return "translate(" + x + ", " + 15 + ")";
            })

        rotaedMarkers.classed("hours-chart__rotaed-interval", true);

        rotaedMarkers
            .append("rect")
            .attr("height", 20)
            .attr("width", function(interval){
                var shiftDuration = interval.endOffsetInHours - interval.startOffsetInHours;
                return xScale(shiftDuration);
            })
        rotaedMarkers
            .append("text")
            .attr("transform", "translate(3, 16)")
            .text(function(interval){
                return interval.label;
            })
    }
    renderClockedIntervals({chart, xScale}){
        chart.append("g")
            .selectAll("g")
            .data(this.props.clockedIntervals)
            .enter()
            .append("rect")
            .attr("width", function(interval, i){
                var intervalLengthInHours = interval.endOffsetInHours - interval.startOffsetInHours;
                return xScale(intervalLengthInHours);
            })
            .attr("height", barHeight)
            .attr("transform", function(interval, i){
                var x = xScale(interval.startOffsetInHours) + padding
                return "translate(" + x + "," + (innerHeight - barHeight / 2) + ")"
            })
            .attr("class", function(interval){
                var classes = ["hours-chart__clocked-interval"];
                if (interval.type === "hours") {
                    classes.push("hours-chart__clocked-interval--hours");
                }
                if (interval.type === "break") {
                    classes.push("hours-chart__clocked-interval--break");
                }
                if (interval.type === "incomplete") {
                    classes.push("hours-chart__clocked-interval--incomplete");
                }
                return classes.join(" ");
            })
    }
}



function getStartOffsetInHours(date){
    var rotaDate = new RotaDate({shiftStartsAt: date})
    return getOffsetInHours(rotaDate, date);
}
function getEndOffsetInHours(date){
    var rotaDate = new RotaDate({shiftEndsAt: date})
    return getOffsetInHours(rotaDate, date);
}
function getOffsetInHours(rotaDate, date){
    return rotaDate.getHoursSinceStartOfDay(date);
}


export default class HoursChart extends React.Component {
    static propTypes = {
        clockedEvents: React.PropTypes.array.isRequired,
        clockedIntervals: React.PropTypes.array.isRequired,
        rotaedShifts: React.PropTypes.array.isRequired
    }
    render(){
        return <HoursChartUi
            clockedIntervals={this.getClockedChartIntervals()}
            rotaedIntervals={this.getRotaedChartIntervals()} />
    }
    getRotaedChartIntervals(){
        return this.props.rotaedShifts.map(function(shift){
            var label = moment(shift.starts_at).format("HH:mm") + " - " +
                moment(shift.ends_at).format("HH:mm");

            return {
                startOffsetInHours: getStartOffsetInHours(shift.starts_at),
                endOffsetInHours: getEndOffsetInHours(shift.ends_at),
                label
            }
        });
    }
    getEventsThatDontBelongToAnInterval(){
        var { clockedEvents, clockedIntervals } = this.props;
        var events = clockedEvents.slice();
        var intervalEventClientIds = [];
        clockedIntervals.forEach(function(interval){
            intervalEventClientIds.push(interval.startEvent.clientId);
            intervalEventClientIds.push(interval.endEvent.clientId);
        });

        var eventsWithoutAnInterval = _.reject(events, function(event){
            return _.contains(intervalEventClientIds, event.clientId)
        });

        return eventsWithoutAnInterval;
    }
    getIncompleteInterval(){
        var eventsWithoutAnInterval = this.getEventsThatDontBelongToAnInterval();
        eventsWithoutAnInterval = _(eventsWithoutAnInterval).filter({type: "clock_in"});
        if (eventsWithoutAnInterval.length > 0) {
            return {
                startOffsetInHours: getStartOffsetInHours(eventsWithoutAnInterval[0].time),
                endOffsetInHours: 24,
                type: "incomplete"
            }
        } else {
            return null;
        }
    }
    getClockedChartIntervals(){
        var {clockedIntervals, clockedEvents} = this.props;

        var completedIntervals = clockedIntervals.map((interval) => {
            var startTime = interval.startEvent.get(clockedEvents).time;
            var endTime = interval.endEvent.get(clockedEvents).time;
            return {
                startOffsetInHours: getStartOffsetInHours(startTime),
                endOffsetInHours: getEndOffsetInHours(endTime),
                type: interval.type
            }
        });

        var intervals = completedIntervals.slice();

        var incompleteInterval = this.getIncompleteInterval();
        if (incompleteInterval !== null) {
            intervals.push(incompleteInterval);
        }

        return intervals;
    }
}