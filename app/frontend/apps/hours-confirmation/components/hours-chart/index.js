import React from "react"
import d3 from "d3"
import RotaDate from "~lib/rota-date"
import makeRotaHoursXAxis from "~lib/make-rota-hours-x-axis"
import _ from "underscore"
import moment from "moment"
import utils from "~lib/utils"
import convertClockInHoursToIntervals from "./convert-clock-in-hours-to-intervals"

var innerWidth = 600;
var innerHeight = 60;
var padding = 20;
var paddingRight = 200;
var barHeight = 30;
var outerWidth = innerWidth + padding + paddingRight;
var outerHeight = innerHeight + padding * 2;

class HoursChartUi extends React.Component {
    render(){
        return <div className="hours-chart">
            <svg ref={(el) => this.el = el} />
            - allow updating hours assignment intervals
        </div>
    }
    componentDidMount(){
        this.renderChart();
    }
    componentWillReceiveProps(newProps){
        if (!utils.deepEqualTreatingFunctionsAsStrings(this.props, newProps)) {
            this.needsFullRerender = true;
        }
    }
    componentDidUpdate(){
        if (this.needsFullRerender) {
            this.renderChart();
            this.needsFullRerender = false;
        }
    }
    renderChart() {
        var self = this;
        this.el.innerHTML = "";

        var chart = d3.select(this.el);
        chart.attr("width", outerWidth);
        chart.attr("height", outerHeight);

        var xScale = this.getXScale()

        this.renderXAxis({chart, xScale})
        this.renderProposedAcceptedIntervals({chart, xScale})
        this.renderClockedIntervals({chart, xScale})
        this.renderRotaedIntervals({chart, xScale})
        this.renderLaneLabels({chart})
    }
    getXScale(){
        return d3.scale.linear()
            .domain([0, 24])
            .range([0, innerWidth]);
    }
    renderProposedAcceptedIntervals({chart, xScale}){
        this.renderIntervals({
            chart,
            xScale,
            intervals: this.props.proposedAcceptedIntervals,
            lane: "proposedAccepted"
        })
    }
    renderIntervals({chart, xScale, intervals, lane}){
        var y = {
            "proposedAccepted": 60,
            "clocked": 30,
            "rotaed": 10
        }[lane]
        chart.append("g")
            .selectAll("g")
            .data(intervals)
            .enter()
            .append("rect")
            .attr("width", function(interval, i){
                var intervalLengthInHours = interval.endOffsetInHours - interval.startOffsetInHours;
                return xScale(intervalLengthInHours);
            })
            .attr("height", barHeight)
            .attr("transform", function(interval, i){
                var x = xScale(interval.startOffsetInHours) + padding
                return "translate(" + x + "," + y + ")"
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
    colorArea({chart, xScale, startPosition, endPosition, color, opacity}){
        chart
            .append("rect")
            .attr("width", xScale(endPosition - startPosition))
            .attr("height", innerHeight + padding)
            .attr("opacity", opacity)
            .attr("fill", color)
            .attr("transform", "translate(" + (xScale(startPosition) + padding) + ", " + 0 + ")");
    }
    renderLaneLabels({chart}){
        var group = chart
            .append("g")
            .attr("transform", "translate(" + (innerWidth + padding + 10) + ",0)")
        group.append("text")
            .text("Rotaed Shifts")
            .attr("transform", "translate(0, 28)")
        group.append("text")
            .text("Clocked Hours")
            .attr("transform", "translate(0, 65)")
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
        this.renderIntervals({
            chart,
            xScale,
            intervals: this.props.rotaedIntervals,
            lane: "rotaed"
        })
    }
    renderClockedIntervals({chart, xScale}){
        this.renderIntervals({
            chart,
            xScale,
            intervals: this.props.clockedIntervals,
            lane: "clocked"
        })
    }
}


export default class HoursChart extends React.Component {
    static propTypes = {
        clockedEvents: React.PropTypes.array.isRequired,
        clockedIntervals: React.PropTypes.array.isRequired,
        rotaedShifts: React.PropTypes.array.isRequired,
        rotaDate: React.PropTypes.instanceOf(RotaDate).isRequired,
        hoursAssignments: React.PropTypes.array.isRequired
    }
    render(){
        return <HoursChartUi
            clockedIntervals={this.getClockedChartIntervals()}
            proposedAcceptedIntervals={this.getProposedAcceptedIntervals()}
            rotaedIntervals={this.getRotaedChartIntervals()}
            // hoursAssignmentIntervals={this.getHoursAssignmentIntervals()}
            />
    }
    getProposedAcceptedIntervals(){
        return this.getIntervalsFromClockInList(this.props.proposedAcceptedClockIns)
    }
    getDateFromHoursOffset(hoursOffset){
        var date = new Date(this.props.rotaDate.startTime);
        date.setMinutes(date.getMinutes() + hoursOffset * 60);
        return date;
    }
    getRotaedChartIntervals(){
        var self = this;
        return this.props.rotaedShifts.map(function(shift){
            var label = moment(shift.starts_at).format("HH:mm") + " - " +
                moment(shift.ends_at).format("HH:mm");

            return {
                startOffsetInHours: self.getHoursSinceStartOfDay(shift.starts_at),
                endOffsetInHours: self.getHoursSinceStartOfDay(shift.ends_at),
                label
            }
        });
    }
    getHoursSinceStartOfDay(date){
        return this.props.rotaDate.getHoursSinceStartOfDay(date);
    }
    getIntervalsFromClockInList(clockInList){
        var clockedIntervals = []
        clockInList.forEach(function(clockIn){
            clockedIntervals = clockedIntervals.concat(convertClockInHoursToIntervals(clockIn))
        })

        var intervals = clockedIntervals.map((interval) => {
            var startTime = interval.starts_at;
            var endTime = interval.ends_at;
            return {
                startOffsetInHours: this.getHoursSinceStartOfDay(startTime),
                endOffsetInHours: this.getHoursSinceStartOfDay(endTime),
                type: interval.type
            }
        });

        return intervals;
    }
    getClockedChartIntervals(){
        return this.getIntervalsFromClockInList(this.props.clockedClockIns)
    }
}
