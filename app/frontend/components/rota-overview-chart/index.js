import React, { Component } from "react"
import getStaffTypeBreakdownByTime from "./get-staff-type-breakdown-by-time"
import _ from "underscore"
import RotaDate from "~lib/rota-date"
import utils from "~lib/utils"
import nvd3 from "nvd3"
import NVD3Chart from "react-nvd3"
import ReactDOM from "react-dom"
import d3 from "d3"
import renderTooltipHtml from "./render-tooltip-html"
import moment from "moment"


const GRANULARITY = 30;
const MILLISECONDS_PER_MINUTE = 60 * 1000;
const MINUTES_PER_HOUR = 60;
const HOVER_INDICATOR_WIDTH = 10;

function getTranslateTransform(x, y){
    return "translate(" + x + "," + y + ")";
}
function convertTranslateToXY(translate){
    var parts = translate.match(/translate\((.*),(.*)\)/);
    return {
        x: parseFloat(parts[1]),
        y: parseFloat(parts[2])
    }
}

export default class RotaOverviewChart extends Component {
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
            yAxis: {
                tickFormat: d3.format("d")
            },
            tooltip: {
                contentGenerator: function(obj){
                    var selectedStaffTypeTitle = obj.series[0].key;
                    var date = breakdown[obj.index].date;
                    var breakdownAtPoint = _(breakdown).find((point) => point.date.valueOf() === date.valueOf());

                    return renderTooltipHtml({
                        shiftsByStaffType: breakdownAtPoint.shiftsByStaffType,
                        selectedStaffTypeTitle,
                        staffTypes: self.props.staffTypes
                    });
                }
            }
        }

        var renderEnd = function(chart){
            chart.multibar.dispatch.on("elementClick", function(obj){
                self.props.onHoverShiftsChange(null);
                var data = self.getSelectionData(breakdown, obj);
                self.props.onSelectionShiftsChange(data);
            });
            chart.multibar.dispatch.on("elementMouseover", function(obj){
                var data = self.getSelectionData(breakdown, obj);
                self.props.onHoverShiftsChange(data);

                self.updateHoverIndicator();
            });
            chart.multibar.dispatch.on("elementMouseout", function(obj){
                self.props.onHoverShiftsChange(null);
                self.updateHoverIndicator();
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
    updateHoverIndicator(){
        var indicator = this.getHoverIndicator();
        var svg = this.getChartSvgElement();
        var hoverBar = d3.select(svg).selectAll(".nv-bar.hover");

        if (hoverBar.empty()) {
            indicator.style("opacity", 0);
        } else {
            var x = convertTranslateToXY(hoverBar.attr("transform")).x;
            x += (hoverBar.attr("width") - HOVER_INDICATOR_WIDTH) / 2;
            var y = hoverBar.attr("y");

            indicator.attr({
                "transform": getTranslateTransform(x, y),
            });
            indicator.style("opacity", 1);
        }
    }
    getChartSvgElement(){
        return ReactDOM.findDOMNode(this).querySelector("svg");
    }
    getHoverIndicator(){
        var svg = d3.select(this.getChartSvgElement());
        var indicator = svg.select(".rota-overview-chart__hover-indicator");
        var nvWrap = svg.select(".nv-wrap");

        if (indicator.empty()) {
            var g = svg.append("g");
            g.attr("transform", nvWrap.attr("transform"));
            indicator = g.append("g");
            indicator.classed("rota-overview-chart__hover-indicator", true);
            indicator.append("circle")
                .attr({
                    cx: HOVER_INDICATOR_WIDTH / 2,
                    cy: 0,
                    r: HOVER_INDICATOR_WIDTH / 2
                })
                .style("fill", "orange");
        }
        return indicator
    }
    getRotaDate(){
        return new RotaDate({dateOfRota: this.props.dateOfRota});
    }
    getBreakdown(){
        var { shifts, staff, staffTypes} = this.props;
        var rotaDate = this.getRotaDate();
        return getStaffTypeBreakdownByTime({
            shifts,
            staff,
            granularityInMinutes: GRANULARITY,
            staffTypes,
            rotaDate
        });
    }
    getSelectionData(breakdown, obj){
        var seriesName = obj.data.key;
        var index = obj.index;

        var staffType = _(this.props.staffTypes).find({name: seriesName});
        var shifts = breakdown[index].shiftsByStaffType[staffType.id];
        return {
            shifts,
            staffType: staffType.id,
            date: breakdown[index].date
        };
    }
    getChartData(breakdown){
        var rotaDate = this.getRotaDate();
        var staffTypes = this.props.staffTypes;
        var series = [];

        for (var staffType in this.props.staffTypes) {
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