import React from "react"
import d3 from "d3"
import utils from "~lib/utils"
import makeRotaHoursXAxis from "~lib/make-rota-hours-x-axis"

var innerWidth = 525;
var innerHeight = 80;
var padding = 20;
var paddingRight = 200;
var labelSpacing = 50;
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
        var currentPropsExceptInteractionState = {...this.props};
        delete currentPropsExceptInteractionState.interactionState;
        var newPropsExceptInteractionState = {...newProps};
        delete newPropsExceptInteractionState.interactionState;
        if (!utils.deepEqualTreatingFunctionsAsStrings(currentPropsExceptInteractionState, newPropsExceptInteractionState)) {
            this.needsFullRerender = true;
        }
    }
    componentDidUpdate(){
        if (this.needsFullRerender) {
            this.renderChart();
            this.needsFullRerender = false;
        }
        else {
            this.updateChartInteractions();
        }
    }
    renderChart() {
        var self = this;
        this.el.innerHTML = "";

        var chart = this.getChart()
        chart.attr("width", outerWidth);
        chart.attr("height", outerHeight);

        var xScale = this.getXScale()

        var chartContent = chart
            .append("g")
            .attr("transform", "translate(" + labelSpacing + ", 0)")


        this.renderXAxis({chartContent, xScale})
        this.renderProposedAcceptedIntervals({chartContent, xScale})
        this.renderClockedIntervals({chartContent, xScale})
        this.renderRotaedIntervals({chartContent, xScale})
        this.renderLaneLabels({chart})
        this.renderEvents({chartContent, xScale})
    }
    getXScale(){
        return d3.scale.linear()
            .domain([0, 24])
            .range([0, innerWidth]);
    }
    getChart(){
        return  d3.select(this.el);
    }
    renderEvents({chartContent, xScale}){
        var group = chartContent.append("g")
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
    renderProposedAcceptedIntervals({chartContent, xScale}){
        this.renderIntervals({
            chart: chartContent,
            xScale,
            intervals: this.props.proposedAcceptedIntervals,
            lane: "amended"
        })
    }
    renderIntervals({chart, xScale, intervals, lane}){
        var y = {
            "amended": 70,
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

        var rectangle = intervalGroup.append("rect")
            .attr("width", function(interval, i){
                var intervalLengthInHours = interval.endOffsetInHours - interval.startOffsetInHours;
                return xScale(intervalLengthInHours);
            })
            .attr("height", barHeight)
            .attr("class", function(interval){
                var classes = ["hours-chart__interval"];

                if (interval.type === "hours") {
                    classes.push("hours-chart__" + lane + "-interval--hours");
                }
                if (interval.type === "break") {
                    classes.push("hours-chart__" + lane + "-interval--break");
                }

                return classes.join(" ")
            })

        if (lane === "clocked") {
            rectangle
                .on("mouseenter", (interval) => {
                    this.props.onHoveredIntervalChange(interval)
                })
                .on("mouseout", (interval) => {
                    this.props.onHoveredIntervalChange(null)
                })
        }

        intervalGroup
            .append("text")
            .attr("transform", "translate(3, 18)")
            .text(function(interval){
                return interval.label;
            })
    }
    updateChartInteractions(){
        this.highlightHoveredInterval()
        this.renderToolTip();
    }
    highlightHoveredInterval(){
        var chart = this.getChart()
        var hoveredInterval = this.props.interactionState.hoveredInterval;

        chart.selectAll(".hours-chart__interval")
            .attr("opacity", 1)
            .filter(function(interval){
                return interval == hoveredInterval
            })
            .attr("opacity", .8)
    }
    renderToolTip(){
        var xScale = this.getXScale()
        var chart = this.getChart()
        var hoveredInterval = this.props.interactionState.hoveredInterval;
        const tooltipWidth = 90;

        if (hoveredInterval) {
            var intervalWidth = xScale(hoveredInterval.endOffsetInHours) - xScale(hoveredInterval.startOffsetInHours)
            var x = xScale(hoveredInterval.startOffsetInHours) + intervalWidth / 2 +
                padding + labelSpacing - tooltipWidth / 2;

            var g = chart.append("g")
                .attr("transform", "translate(" + x + ", 4)")
                .attr("class", "hours-chart__tooltip")

            g.append("rect")
                .attr("width", tooltipWidth)
                .attr("height", 30)

            var arrow = g.append("polygon")
                .attr("points", "0,0 5,5 10,0")
                .attr("fill", "black")
                .attr("transform", "translate(" + (tooltipWidth/2 - 10/2) + ", 30)")

            g.append("text")
                .text(hoveredInterval.tooltipLabel)
                .attr("fill", "white")
                .attr("transform", "translate(4, 20)")
        } else {
            chart.selectAll(".hours-chart__tooltip")
                .remove();
        }
    }
    renderLaneLabels({chart}){
        var group = chart
            .append("g")
            .attr("transform", "translate(" + (padding + labelSpacing - 10) + ",0)")
        group.append("text")
            .text("Rotaed")
            .attr("transform", "translate(0, 25)")
        group.append("text")
            .text("Clocked")
            .attr("transform", "translate(0, 55)")
        group.append("text")
            .text("Amended")
            .attr("transform", "translate(0, 85)")
        group.selectAll("text")
            .attr("text-anchor", "end")
    }
    renderXAxis({chartContent, xScale}){
        var xAxis = makeRotaHoursXAxis(xScale);
         chartContent
            .append("g")
            .attr("transform", "translate(" + padding + "," + (innerHeight + padding) + ")")
            .attr("class", "axis")
            .call(xAxis);
    }
    renderRotaedIntervals({chartContent, xScale}){
        this.renderIntervals({
            chart: chartContent,
            xScale,
            intervals: this.props.rotaedIntervals,
            lane: "rotaed"
        })
    }
    renderClockedIntervals({chartContent, xScale}){
        this.renderIntervals({
            chart: chartContent,
            xScale,
            intervals: this.props.clockedIntervals,
            lane: "clocked"
        })
    }
}
