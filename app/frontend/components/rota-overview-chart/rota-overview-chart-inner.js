import React, { Component } from "react"
import _ from "underscore"
import d3 from "d3"
window.d3 = d3; // nvd3 relies on global D3
import nvd3 from "nvd3"
import NVD3Chart from "react-nvd3"
import ReactDOM from "react-dom"


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

export default class RotaOverviewChartInner extends Component {
    static propTypes = {
        chartData: React.PropTypes.array.isRequired,
        onElementClick: React.PropTypes.func.isRequired,
        onElementMouseover: React.PropTypes.func.isRequired,
        onElementMouseout: React.PropTypes.func.isRequired,
        tooltipGenerator: React.PropTypes.func.isRequired,
        rotaDate: React.PropTypes.func.isRequired
    }
    render() {
        var self = this;

        var datum = this.props.chartData;
        var options = {
            margin: {},
            stacked: true,
            showControls: false,
            yAxis: {
                tickFormat: d3.format("d")
            },
            xAxis: {
                tickValues: this.getTickValues(),
                tickFormat: function(xValue){
                    return new Date(xValue).getHours()
                },
                axisLabel: "Time"
            },
            tooltip: {
                contentGenerator: this.props.tooltipGenerator
            },
            reduceXTicks: false
        }

        var renderEnd = function(chart){
            chart.multibar.dispatch.on("elementClick", self.props.onElementClick);
            chart.multibar.dispatch.on("elementMouseover", function(obj){
                self.props.onElementMouseover(obj);
                self.updateHoverIndicator();
            });
            chart.multibar.dispatch.on("elementMouseout", function(obj){
                self.props.onElementMouseout(obj);
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
    getTickValues(){
        var tickValues = [];
        var startTime = this.props.rotaDate.startTime;
        for (var i=0; i< 25; i++) {
            var date = new Date(startTime.valueOf() + i * 60 * 60 * 1000)
            tickValues.push(date.valueOf())
        }
        return tickValues;
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
}