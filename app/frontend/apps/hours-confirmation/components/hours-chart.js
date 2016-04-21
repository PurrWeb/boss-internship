import React from "react"
import d3 from "d3"
import RotaDate from "~lib/rota-date"
import makeRotaHoursXAxis from "~lib/make-rota-hours-x-axis"

var innerWidth = 500;
var barHeight = 40;

class HoursChartUi extends React.Component {
    render(){
        return <div>
            <svg ref={(el) => this.el = el} />
        </div>
    }
    componentDidMount(){
        this.renderChart();
    }
    renderChart() {

        var chart = d3.select(this.el);
        chart.attr("width", innerWidth)

        var xScale = d3.scale.linear()
            .domain([0, 24])
            .range([0, innerWidth]);
        var xAxis = makeRotaHoursXAxis(xScale)

        this.renderIntervals({chart, xScale})
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
                var x = xScale(interval.startOffsetInHours)
                return "translate(" + x + ",0)"
            })
            .attr("class", function(interval){
                var classes = ["hours-chart__interval"];
                if (interval.type === "hours") {
                    classes.push("hours-chart__interval--hours");
                }
                if (interval.type === "break") {
                    classes.push("hours-chart__interval--break");
                }
                return classes.join(" ");
            })
    }
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
    getChartIntervals(){
        var {clockedIntervals, clockedEvents} = this.props;

        return clockedIntervals.map((interval) => {
            var startTime = interval.startEvent.get(clockedEvents).time;
            var endTime = interval.endEvent.get(clockedEvents).time;
            return {
                startOffsetInHours: getStartOffsetInHours(startTime),
                endOffsetInHours: getEndOffsetInHours(endTime),
                type: interval.type
            }
        });

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
    }
}