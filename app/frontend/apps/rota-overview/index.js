import React, { Component } from "react"
import { getStaffTypeBreakdownByTime } from "./rota-overview-data"
import _ from "underscore"
const ReactHighCharts = require('react-highcharts/bundle/highcharts')

export default class RotaOverviewView extends Component {
    render() {
        var shifts = this.props.rotaShifts;
        var staff = this.props.staff;
        var staffTypes = this.props.staffTypes;


        var data = getStaffTypeBreakdownByTime(shifts, staff, 30 , staffTypes)

        var series = [];
        var config = {
            chart: {
                type: "area"
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
            var staffTypeData = _(data).mapValues(function(item){
                return item[staffType];
            });

            staffTypeData = _.values(staffTypeData);
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