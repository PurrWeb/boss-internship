import React, { Component } from "react"
import getStaffTypeBreakdownByTime from "./get-staff-type-breakdown-by-time"
import _ from "underscore"
import RotaDate from "~lib/rota-date"
import utils from "~lib/utils"
import nvd3 from "nvd3"
import NVD3Chart from "react-nvd3"


const GRANULARITY = 30;
const MILLISECONDS_PER_MINUTE = 60 * 1000;
const MINUTES_PER_HOUR = 60;

export default class RotaOverviewView extends Component {
    static propTypes = {
        shifts: React.PropTypes.array.isRequired,
        staffTypes: React.PropTypes.object.isRequired,
        staff: React.PropTypes.object.isRequired,
        dateOfRota: React.PropTypes.instanceOf(Date),
        onHoverShiftsChange: React.PropTypes.func.isRequired,
        onSelectionShiftsChange: React.PropTypes.func.isRequired
    }
    shouldComponentUpdate(nextProps, nextState){
        return !utils.deepEqualTreatingFunctionsAsStrings(
            nextProps,
            this.props
        );
    }
    render() {
        var self = this;
        var breakdown = this.getBreakdown();

        var datum = this.getChartData(breakdown);
        var options = {
            margin: {},
            stacked: true,
            showControls: false,
            tooltip: {
                contentGenerator: function(obj){
                    var selectedStaffTypeTitle = obj.data.key
                    var date = breakdown[obj.index].date;
                    var breakdownAtPoint = _(breakdown).find((point) => point.date.valueOf() === date.valueOf());

                    return renderTooltipHtml({
                        shiftsByStaffType: breakdownAtPoint.shiftsByStaffType,
                        selectedStaffTypeTitle,
                        staffTypes: self.props.staffTypes
                    })
                }
            }
        }

        var renderEnd = function(chart){
            chart.multibar.dispatch.on("elementClick", function(obj){
                self.props.onHoverShiftsChange(null);
                var data = self.getSelectionData(breakdown, obj.data.key, obj.index);
                self.props.onSelectionShiftsChange(data);
            });
            chart.multibar.dispatch.on("elementMouseover", function(obj){
                var data = self.getSelectionData(breakdown, obj.data.key, obj.index);
                self.props.onHoverShiftsChange(data);
            });
            chart.multibar.dispatch.on("elementMouseout", function(obj){
                self.props.onHoverShiftsChange(null);
            });
        }

        return <div className="rota-overview-chart">
            <NVD3Chart
                options={options}
                type="multiBarChart"
                datum={datum}
                x="label"
                y="value"
                margin={{}}
                renderEnd={renderEnd}/>
        </div>
    }
    getRotaDate(){
        return new RotaDate(this.props.dateOfRota);
    }
    getBreakdown(){
        var { shifts, staff} = this.props;
        var staffTypes = this.getStaffTypesWithShifts();
        var rotaDate = this.getRotaDate();
        return getStaffTypeBreakdownByTime({
            shifts,
            staff,
            granularityInMinutes: GRANULARITY,
            staffTypes,
            rotaDate
        });
    }
    getStaffTypesWithShifts(){
        var {shifts, staff} = this.props;

        var allStaffTypes = this.props.staffTypes;
        var shiftStaffTypes = _(shifts).map(getStaffTypeFromShift);
        var staffTypes = _(allStaffTypes).filter(function(staffType){
            return _(shiftStaffTypes).contains(staffType.id);
        });
        return _(staffTypes).indexBy("id");

        function getStaffTypeFromShift(shift) {
            return staff[shift.staff_member.id].staff_type.id;
        }
    }
    getSelectionData(breakdown, seriesName, index){
        var staffType = _(this.props.staffTypes).find({name: seriesName});
        var shifts = breakdown[index].shiftsByStaffType[staffType.id];
        return {
            shifts,
            staffType: staffType.id,
            date: breakdown[index].date
        };
    }
    getChartData(breakdown){
        var rotaDate = new RotaDate(this.props.dateOfRota);
        var staffTypes = this.props.staffTypes;
        var series = [];

        for (var staffType in this.getStaffTypesWithShifts()) {
            var values = _(breakdown).map(function(item){
                return {
                    value: item.shiftsByStaffType[staffType].length,
                    label: moment(item.date).format("HH:mm")
                }
            });
            series.push({
                key: staffTypes[staffType].name,
                values: values,
                color: staffTypes[staffType].color,
                pointStart: rotaDate.startTime.valueOf(),
                pointInterval: GRANULARITY * MILLISECONDS_PER_MINUTE,
            });
        }
        return series;
    }
}

function renderTooltipHtml(data){
    function renderLine(staffType){
        var shifts = data.shiftsByStaffType[staffType];
        var staffTypeObject = data.staffTypes[staffType];
        var isSelected = data.selectedStaffTypeTitle === staffTypeObject.name;

        var line = shifts.length + " - " + staffTypeObject.name;
        if (isSelected) {
            line = "<b>" + line + "</b>";
        }
        return line;
    }

    var selectedStaffType = _(data.staffTypes).find({name: data.selectedStaffTypeTitle}).id;

    var tooltipLines = [];
    tooltipLines.push(
        renderLine(selectedStaffType)
    );

    _(data.shiftsByStaffType).each(function(shifts, staffType){
        if (staffType == selectedStaffType) {
            return;
        }
        tooltipLines.push(
            renderLine(staffType)
        );
    });

    return tooltipLines.join("<br>");
}