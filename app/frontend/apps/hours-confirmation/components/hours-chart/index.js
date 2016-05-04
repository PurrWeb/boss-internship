import React from "react"
import d3 from "d3"
import RotaDate from "~lib/rota-date"
import makeRotaHoursXAxis from "~lib/make-rota-hours-x-axis"
import _ from "underscore"
import moment from "moment"
import utils from "~lib/utils"
import convertClockInHoursToIntervals from "./convert-clock-in-hours-to-intervals"

var innerWidth = 600;
var innerHeight = 80;
var padding = 20;
var paddingRight = 200;
var barHeight = 25;
var outerWidth = innerWidth + padding + paddingRight;
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
            "proposedAccepted": 70,
            "clocked": 40,
            "rotaed": 10
        }[lane]
        var intervalGroup = chart
            .append("g")
            .selectAll("g")
            .data(intervals)
            .enter()
            .append("g")
            .attr("transform", function(interval, i){
                var x = xScale(interval.startOffsetInHours) + padding
                return "translate(" + x + "," + y + ")"
            })
            .attr("class", function(interval){
                var classes = [];
                console.log(interval.type)
                if (interval.type == "rotaed") {
                    classes.push("hours-chart__rotaed-interval")
                }
                return classes.join(" ")
            })

        intervalGroup.append("rect")
            .attr("width", function(interval, i){
                var intervalLengthInHours = interval.endOffsetInHours - interval.startOffsetInHours;
                return xScale(intervalLengthInHours);
            })
            .attr("height", barHeight)
            .attr("class", function(interval){
                var classes = ["hours-chart__clocked-interval"];

                if (interval.type === "hours") {
                    classes.push("hours-chart__clocked-interval--hours");
                }
                if (interval.type === "break") {
                    classes.push("hours-chart__clocked-interval--break");
                }

                return classes.join(" ")
            })

        intervalGroup
            .append("text")
            .attr("transform", "translate(3, 18)")
            .text(function(interval){
                return interval.label;
            })
    }
    renderLaneLabels({chart}){
        var group = chart
            .append("g")
            .attr("transform", "translate(" + (innerWidth + padding + 10) + ",0)")
        group.append("text")
            .text("Rotaed Shifts")
            .attr("transform", "translate(0, 25)")
        group.append("text")
            .text("Clocked Hours")
            .attr("transform", "translate(0, 55)")
        group.append("text")
            .text("Proposed/Accepted Hours")
            .attr("transform", "translate(0, 85)")
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
                label,
                type: "rotaed"
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
