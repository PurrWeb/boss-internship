import React, { Component } from "react"
import { getStaffTypeBreakdownByTime } from "./rota-overview-data"
import _ from "underscore"
import RotaDate from "~lib/rota-date"
const ReactHighCharts = require('react-highcharts/bundle/highcharts')

const GRANULARITY = 30;
const MILLISECONDS_PER_MINUTE = 60 * 1000;

export default class RotaOverviewView extends Component {
    render() {
        var shifts = this.props.rotaShifts;
        var staff = this.props.staff;
        var staffTypes = this.props.staffTypes;
        var rotaDate = new RotaDate(this.props.dateOfRota);

        var data = getStaffTypeBreakdownByTime({
            shifts,
            staff,
            granularityInMinutes: GRANULARITY,
            staffTypes,
            rotaDate
        });

        var series = [];
        var config = {
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
            series: series,
            plotOptions: {
                area: {
                    stacking: "normal",
                    lineColor: "#666666",
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: "#666666"
                    }
                }
            },
        };

        for (var staffType in staffTypes) {
            var staffTypeData = _(data).map(function(item){
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

        return <div>
            <ReactHighCharts config={config} />
        </div>
    }
}