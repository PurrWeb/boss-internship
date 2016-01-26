import React, { Component } from "react"
import { getStaffTypeBreakdownByTime } from "./rota-overview-data"
import _ from "underscore"
import RotaDate from "~lib/rota-date"
const ReactHighCharts = require('react-highcharts/bundle/highcharts')

const GRANULARITY = 30;
const MILLISECONDS_PER_MINUTE = 60 * 1000;

export default class RotaOverviewView extends Component {
    static propTypes = {
        shifts: React.PropTypes.array.isRequired,
        staffTypes: React.PropTypes.object.isRequired,
        staff: React.PropTypes.array.isRequired,
        dateOfRota: React.PropTypes.instanceOf(Date),
        onHoverShiftsChange: React.PropTypes.func.isRequired,
        onSelectionShiftsChange: React.PropTypes.func.isRequired
    }
    shouldComponentUpdate(nextProps, nextState){
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
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

        config.series = this.getChartData(breakdown);

        return <div>
            <ReactHighCharts config={config} />
        </div>
    }
    getBreakdown(){
        var { shifts, staffTypes, staff} = this.props;
        var rotaDate = new RotaDate(this.props.dateOfRota);
        return getStaffTypeBreakdownByTime({
            shifts,
            staff,
            granularityInMinutes: GRANULARITY,
            staffTypes,
            rotaDate
        });
    }
    getSelectionData(breakdown, series, index){
        var staffType = _(this.props.staffTypes).find({title: series.name});
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
            var staffTypeData = _(breakdown).map(function(item){
                return item.shiftsByStaffType[staffType].length;
            });

            series.push({
                name: staffTypes[staffType].title,
                data: staffTypeData,
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