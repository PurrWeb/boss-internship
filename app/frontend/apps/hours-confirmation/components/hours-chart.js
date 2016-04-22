import React from "react"
import d3 from "d3"
import RotaDate from "~lib/rota-date"
import makeRotaHoursXAxis from "~lib/make-rota-hours-x-axis"
import _ from "underscore"

var innerWidth = 500;
var innerHeight = 100;
var padding = 40;
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
        this.renderIntervals({chart, xScale})
    }
    renderXAxis({chart, xScale}){
        var xAxis = makeRotaHoursXAxis(xScale);
         chart
            .append("g")
            .attr("transform", "translate(" + padding + "," + (innerHeight + padding) + ")")
            .attr("class", "axis")
            .call(xAxis);
    }
    renderIntervals({chart, xScale}){
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
                return "translate(" + x + "," + padding + ")"
            })
            .attr("class", function(interval){
                var classes = ["hours-chart__interval"];
                if (interval.type === "hours") {
                    classes.push("hours-chart__interval--hours");
                }
                if (interval.type === "break") {
                    classes.push("hours-chart__interval--break");
                }
                if (interval.type === "incomplete") {
                    classes.push("hours-chart__interval--incomplete");
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
        clockedIntervals: React.PropTypes.array.isRequired
    }
    render(){
        return <HoursChartUi
            clockedIntervals={this.getChartIntervals()} />
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
    getChartIntervals(){
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