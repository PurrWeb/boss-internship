import React, { Component } from "react"
import d3 from "d3"
import RotaDate from "../../lib/rota-date.js"
import moment from "moment"
import _ from 'underscore'

const MAX_HEIGHT_PER_PERSON = 20;
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;

class RotaChart extends Component {
    static contextTypes = {
        staffTypes: React.PropTypes.object
    }
    constructor(props){
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState){
        return JSON.stringify(this.props) !== JSON.stringify(nextProps);
    }
    render() {
        return (
            <div>
                <svg id="rota-chart"></svg>
            </div>
        )
    }
    componentDidMount() {
        this.initGraph(document.getElementById("rota-chart"));
    }
    componentDidUpdate(prevProps, prevState){
        this.initGraph(document.getElementById("rota-chart"));
    }
    getStaffMembersOnRota(){
        var staffList = _.chain(this.props.rotaShifts)
            .pluck("staff_id")
            .unique()
            .map((staff_id) => this.props.staff[staff_id])
            .value();

        staffList = _(staffList).sortBy("staff_type")
        return staffList;
    }
    getRotaDate(){
        var exampleDateFromTheDay;
        if (this.props.rotaShifts.length > 0) {
            exampleDateFromTheDay = this.props.rotaShifts[0].starts_at;
        } else {
            // Any date will do since there's no data anyway
            exampleDateFromTheDay = new Date();
        }
        var rotaBaseDate = new Date(exampleDateFromTheDay);
        var rotaDate = new RotaDate(rotaBaseDate);
        return rotaDate;
    }
    generateRotaShiftList(staffList){
        var rotaDate = this.getRotaDate();
        function calculateOffsetInHours(date){
            var offsetInMilliseconds = date.valueOf() - rotaDate.startTime.valueOf();
            var offsetInHours = offsetInMilliseconds / MILLISECONDS_PER_HOUR;
            return offsetInHours;
        }

        var staffIdsInOrder = _(staffList).pluck("id");

        var rotaShifts = this.props.rotaShifts.map(
            (rotaShift, i) => {
                var staff = this.props.staff[rotaShift.staff_id];

                return {
                    startOffset: calculateOffsetInHours(rotaShift.starts_at),
                    endOffset: calculateOffsetInHours(rotaShift.ends_at),
                    staff: staff,
                    staffIndex: _(staffIdsInOrder).indexOf(staff.id),
                    originalShiftObject: rotaShift
                };
            }
        );
        return rotaShifts;
    }
    initGraph(el) {
        if (!el) {
            console.log("not rendering graph, el is falsy")
            return;
        }

        var previousInnerHTML = el.innerHTML;
        el.innerHTML = "";

        var self = this;
        var staffList = this.getStaffMembersOnRota();
        var rotaShifts = this.generateRotaShiftList(staffList);
        var numberOfDifferentStaffMembers = staffList.length;

        var innerHeight = 450;
        // Using Math.floor means that there's some empty space at the top of the chart
        var heightPerPerson = Math.floor(innerHeight / numberOfDifferentStaffMembers);
        if (heightPerPerson > MAX_HEIGHT_PER_PERSON) {
            heightPerPerson = MAX_HEIGHT_PER_PERSON;
        }

        var aggregateHeightOfBars = heightPerPerson * numberOfDifferentStaffMembers;
        var verticalSpacingToPushBarsToBottom = innerHeight - aggregateHeightOfBars;


        var innerWidth = 700,
            padding = 20,
            width = innerWidth + padding * 2,
            height = innerHeight + padding * 2;

        var {xScale, barWidthScale} = this.getScales(innerWidth);

        var chart = d3.select(el)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${padding}, ${padding})`)

        var xAxis = this.getXAxis(xScale);

        chart
            .append("g")
            .attr("transform", "translate(0," + (height - padding * 2) + ")")
            .attr("class", "axis")
            .call(xAxis);

        console.log("verticalSpacingToPushBarsToBottom", verticalSpacingToPushBarsToBottom)

        var bar = chart.append("g")
            .selectAll("g")
            .data(rotaShifts)
            .enter().append("g")
            .classed("rota-chart__shift", true)
            .attr("transform", function(rotaShift, i) {
                var transformX = xScale(rotaShift.startOffset);
                return "translate(" +
                    transformX
                    + "," +
                    (rotaShift.staffIndex * heightPerPerson + verticalSpacingToPushBarsToBottom)
                 + ")";
            });
        bar.append("rect")
            .attr("width", function(shift){
                var hours = shift.endOffset - shift.startOffset
                return barWidthScale(hours)
            })
            .attr("style", function(shift){
                return "fill:" + self.context.staffTypes[shift.staff.staff_type].color;
            })
            .on("mouseenter", function(shift){
                self.showShiftPreview(shift);
                d3.select(this.parentNode)
                    .classed("rota-chart__previewed-shift", true)
            })
            .on("mouseout", function(shift){
                self.stopShowingShiftPreview(shift);
                d3.select(this.parentNode)
                    .classed("rota-chart__previewed-shift", false);
            })
            .on("click", function(shift){
                self.stopShowingShiftPreview();
                self.props.updateShiftToShow(shift.originalShiftObject)
                d3.select(".rota-chart__selected-shift")
                    .classed("rota-chart__selected-shift", false);
                d3.select(this.parentNode)
                    .classed("rota-chart__selected-shift", true);
            })
            .attr("height", heightPerPerson - 1);
        bar.append("text")
            .text(function(shift){
                if (heightPerPerson < 20) {
                    return "";
                }
                var staff = shift.staff;
                var formattedStartTime = moment(shift.originalShiftObject.starts_at).format("HH:mm");
                var formattedEndTime = moment(shift.originalShiftObject.ends_at).format("HH:mm");
                return `${staff.first_name} ${staff.surname} (${formattedStartTime} - ${formattedEndTime})`;
            })
            .attr("dx", 4)
            .attr("dy", 8)
            .classed("rota-chart__shift-label", true)
            .attr("text-anchor", "middle");


    }
    getXAxis(xScale){
        var xAxis = d3.svg.axis();
        xAxis.scale(xScale);
        xAxis.ticks(24 - this.getHoursNotShown())
        xAxis.tickSize(-innerHeight) // draw lines across the whole chart for each tick
        xAxis.tickFormat(function(offset){
            var hours = offset + 8;
            if (hours > 23) {
                hours -= 24;
            }
            return hours
        })
        return xAxis;
    }
    getScales(innerWidth){
        var hoursNotShownOnTheLeft = this.getHoursNotShownOnTheLeft();
        var hoursNotShownOnTheRight = this.getHoursNotShownOnTheRight();
        var hoursNotShown = this.getHoursNotShown();

        var xScale = d3.scale.linear()
            .domain([hoursNotShownOnTheLeft, 24 - hoursNotShownOnTheRight])
            .range([0, innerWidth]);
        var barWidthScale = d3.scale.linear()
            .domain([0, 24 - hoursNotShown])
            .range([0, innerWidth]);

        return {xScale, barWidthScale};
    }
    showShiftPreview(shift) {
        this.props.updateShiftToPreview(shift.originalShiftObject);
    }
    stopShowingShiftPreview(shift) {
        this.props.updateShiftToPreview(null);
    }
    getHoursNotShown(){
        var hoursNotShownOnTheLeft = this.getHoursNotShownOnTheLeft();
        var hoursNotShownOnTheRight = this.getHoursNotShownOnTheRight();

        return hoursNotShownOnTheLeft + hoursNotShownOnTheRight;
    }
    getHoursNotShownOnTheLeft(){
        var rotaDate = this.getRotaDate();
        var chartStartTime = rotaDate.getDateFromShiftStartTime(this.props.startTime, 0).valueOf();
        var dayStartTime = rotaDate.startTime.valueOf();
        var msNotShown = chartStartTime - dayStartTime;
        return msNotShown / MILLISECONDS_PER_HOUR;
    }
    getHoursNotShownOnTheRight(){
        var rotaDate = this.getRotaDate();
        var chartEndTime = rotaDate.getDateFromShiftEndTime(this.props.endTime, 0).valueOf();
        var dayEndTime = rotaDate.endTime.valueOf();
        var msNotShown = dayEndTime - chartEndTime;
        return msNotShown / MILLISECONDS_PER_HOUR;
    }
}

export default RotaChart