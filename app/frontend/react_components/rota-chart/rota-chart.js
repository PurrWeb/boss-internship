import React, { Component } from "react"
import d3 from "d3"
import RotaDate from "../../lib/rota-date.js"
import moment from "moment"
import _ from 'underscore'

const MAX_HEIGHT_PER_PERSON = 20;

export default class RotaChart extends Component {
    constructor(props){
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState){
        console.log("shoudlcomponentupdate", this.props, nextProps)
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
    generateRotaShiftList(staffList){
        var rotaBaseDate = new Date(this.props.rotaShifts[0].starts_at);
        var rotaDate = new RotaDate(rotaBaseDate);
        const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
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
        if (this.props.rotaShifts.length === 0) {
            return;
        }

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

        var xScale = d3.scale.linear()
            .domain([0, 24])
            .range([0, innerWidth]);

        var chart = d3.select(el)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${padding}, ${padding})`)

        var xAxis = d3.svg.axis();
        xAxis.scale(xScale);
        xAxis.ticks(24)
        xAxis.tickSize(-500)
        xAxis.tickFormat(function(offset){
            var hours = offset + 8;
            if (hours > 23) {
                hours -= 24;
            }
            return hours
        })
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
                return xScale(hours)
            })
            .attr("style", function(shift){
                return "fill:" + self.props.staffTypes[shift.staff.staff_type].color;
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
    showShiftPreview(shift) {
        this.props.updateShiftToPreview(shift.originalShiftObject);
    }
    stopShowingShiftPreview(shift) {
        this.props.updateShiftToPreview(null);
    }
}
