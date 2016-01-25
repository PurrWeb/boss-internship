import React, { Component } from "react"
import { getStaffTypeBreakdownByTime } from "./rota-overview-data"
import _ from "underscore"
import RotaDate from "~lib/rota-date"
const ReactHighCharts = require('react-highcharts/bundle/highcharts')

export default class RotaOverviewView extends Component {
    render() {
        var shifts = this.props.rotaShifts;
        var staff = this.props.staff;
        var staffTypes = this.props.staffTypes;

        const GRANULARITY = 30;
        var data = getStaffTypeBreakdownByTime({
            shifts,
            staff,
            granularityInMinutes: GRANULARITY,
            staffTypes,
            rotaDate: new RotaDate(this.props.dateOfRota)
        });

        var series = [];
        var config = {
            chart: {
                type: "area"
            },
            title: {
                text: "Rota Overview"
            },
            yAxis: {
                title: {
                    text: 'Time'
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            },
            series: series,
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
        };

        for (var staffType in staffTypes) {
            var staffTypeData = _(data).map(function(item){
                return item.shiftsByStaffType[staffType].length;
            });

            series.push({
                name: staffType,
                data: staffTypeData
            })
        }

        return <div>
            <ReactHighCharts config={config} />
        </div>
    }
}