import React from "react"
import d3 from "d3"
import utils from "~lib/utils"
import makeRotaHoursXAxis from "~lib/make-rota-hours-x-axis"

var innerWidth = 500;
var innerHeight = 80;
var padding = 20;
var paddingRight = 200;
var barHeight = 25;
var outerWidth = innerWidth + padding + paddingRight;
var outerHeight = innerHeight + padding * 2;

export default class HoursChartUi extends React.Component {
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
        this.renderEvents({chart, xScale})
    }
    getXScale(){
        return d3.scale.linear()
            .domain([0, 24])
            .range([0, innerWidth]);
    }
    renderEvents({chart, xScale}){
        var group = chart.append("g")
        var lineContainers = group
            .selectAll("g")
            .data(this.props.events)
            .enter()
            .append("g")
            .attr("transform", function(event){
                var x  = xScale(event.timeOffset) + padding;
                return "translate(" + x + ",40)";
            })

        lineContainers
            .append("line")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("stroke", function(event){
                return {
                    "clock_in": "black",
                    "clock_out": "black",
                    "start_break": "red",
                    "end_break": "red"
                }[event.type]
            })
            .attr("stroke-width", function(event){
                return 3
            })
            .attr("y1", -2)
            .attr("y2", 2 + barHeight)

        var clockInOutContainers = lineContainers
            .filter(function(event){
                return event.type === "clock_in" || event.type === "clock_out"
            })

        clockInOutContainers
            .append("line")
            .attr("y1", -2)
            .attr("y2", -2)
            .classed("hours-confirmation-chart__clock-in-out-markers", true)

        clockInOutContainers
            .append("line")
            .attr("y1", 25)
            .attr("y2", 25)
            .classed("hours-confirmation-chart__clock-in-out-markers", true)

        var clockInOutMarkers = lineContainers
            .selectAll(".hours-confirmation-chart__clock-in-out-markers")

        clockInOutMarkers
            .attr("x1", function(event){
                return {
                    "clock_in": -1.5,
                    "clock_out": -6
                }[event.type]
            })
            .attr("x2", function(event){
                return {
                    "clock_in": 8,
                    "clock_out": 2
                }[event.type]
            })
            .attr("stroke", "black")
            .attr("stroke-width", 3)




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
