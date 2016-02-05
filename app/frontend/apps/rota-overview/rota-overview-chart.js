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
        var config = this.getStaticConfig();

        config.plotOptions.series.point.events = {
            mouseOver: function(event){
                var data = self.getSelectionData(breakdown, this.series, this.index);
                self.props.onHoverShiftsChange(data);
            },
            mouseOut: function(event){
                self.props.onHoverShiftsChange(null);
            },
            click: function(event){
                self.props.onHoverShiftsChange(null);
                var data = self.getSelectionData(breakdown, this.series, this.index);
                self.props.onSelectionShiftsChange(data);
            }
        };

        config.tooltip = {
            formatter: function() {
                var selectedStaffTypeTitle = this.series.name;
                var date = new Date(this.x);
                var breakdownAtPoint = _(breakdown).find((point) => point.date.valueOf() === date.valueOf());

                return renderTooltipHtml({
                    shiftsByStaffType: breakdownAtPoint.shiftsByStaffType,
                    selectedStaffTypeTitle,
                    staffTypes: self.props.staffTypes
                })
            }
        };


        var datum = this.getChartData(breakdown);

        return <div className="rota-overview-chart">
            <NVD3Chart options={{stacked: true}} id="barChart" type="multiBarChart" datum={datum} x="label" y="value"/>
        </div>
    }
    getRotaDate(){
        return new RotaDate(this.props.dateOfRota);
    }
    getBreakdown(){
        var { shifts, staffTypes, staff} = this.props;
        var rotaDate = this.getRotaDate();
        return getStaffTypeBreakdownByTime({
            shifts,
            staff,
            granularityInMinutes: GRANULARITY,
            staffTypes,
            rotaDate
        });
    }
    getSelectionData(breakdown, series, index){
        var staffType = _(this.props.staffTypes).find({name: series.name});
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

        for (var staffType in staffTypes) {
            var values = _(breakdown).map(function(item){
                return {
                    value: item.shiftsByStaffType[staffType].length,
                    label: item.date.toString()
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
    getStaticConfig(){
        return {
            chart: {
                type: "area"
            },
            title: {
                text: "Rota Overview"
            },
            xAxis: {
                type: "datetime",
                title: {
                    text: "Time"
                }
            },
            plotOptions: {
                area: {
                    stacking: "normal",
                    // this makes it so you can click on the area instead of just on the individual data points.
                    trackByArea: true,
                    animation: false,
                    lineColor: "#666666",
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    }
                },
                series: {
                    point: {}
                }
            },
        };
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