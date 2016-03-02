import React, { Component } from "react"
import _ from "underscore"
import RotaDate from "~lib/rota-date"
import utils from "~lib/utils"
import nvd3 from "nvd3"
import NVD3Chart from "react-nvd3"
import ReactDOM from "react-dom"
import d3 from "d3"
import moment from "moment"

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
        groups: React.PropTypes.array.isRequired,
        staff: React.PropTypes.object.isRequired,
        dateOfRota: React.PropTypes.instanceOf(Date),
        onHoverShiftsChange: React.PropTypes.func.isRequired,
        onSelectionShiftsChange: React.PropTypes.func.isRequired,
        tooltipGenerator: React.PropTypes.func.isRequired,
        getBreakdown: React.PropTypes.func.isRequired,
        granularity: React.PropTypes.number.isRequired
    }
    shouldComponentUpdate(nextProps, nextState){
        return !utils.deepEqualTreatingFunctionsAsStrings(
            nextProps,
            this.props
        );
    }
    render() {
        var self = this;
        var breakdown = this.props.getBreakdown();

        var datum = this.getChartData(breakdown);
        var options = {
            margin: {},
            stacked: true,
            showControls: false,
            yAxis: {
                tickFormat: d3.format("d")
            },
            tooltip: {
                contentGenerator: (obj) => this.props.tooltipGenerator(obj, breakdown)
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
    getSelectionData(breakdown, obj){
        var seriesName = obj.data.key;
        var index = obj.index;

        var group = this.getGroupsByName()[seriesName];
        var shifts = breakdown[index].shiftsByGroup[group.id];
        return {
            shifts,
            groupId: group.id,
            date: breakdown[index].date
        };
    }
    getGroupsByName(){
        return _(this.props.groups).indexBy("name");
    }
    getChartData(breakdown){
        var rotaDate = this.getRotaDate();
        var groups = this.props.groups;
        var series = [];
        var granularity = this.props.granularity;

        groups.forEach(function(group){
            var values = _(breakdown).map(function(item){
                return {
                    value: item.shiftsByGroup[group.id].length,
                    label: moment(item.date).format("HH:mm")
                }
            });
            series.push({
                key: group.name,
                values: values,
                color: group.color,
                pointStart: rotaDate.startTime.valueOf(),
                pointInterval: granularity * MILLISECONDS_PER_MINUTE
            });
        });
        return series;
    }
}