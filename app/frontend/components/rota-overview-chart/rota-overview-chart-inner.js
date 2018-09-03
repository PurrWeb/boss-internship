import PropTypes from 'prop-types';
import React, { Component } from "react"
import _ from "underscore"
import d3 from "d3"
window.d3 = d3; // nvd3 relies on global D3
import nvd3 from "nvd3"
import NVD3Chart from "react-nvd3"
import ReactDOM from "react-dom"
import iScroll from 'boss-iscroll';
import ReactIScroll from 'react-iscroll';

const HOVER_INDICATOR_WIDTH = 10;

const MILLISECONDS_PER_HOURS = 60 * 60 * 1000;

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
        chartData: PropTypes.array.isRequired,
        onElementClick: PropTypes.func.isRequired,
        onElementMouseover: PropTypes.func.isRequired,
        onElementMouseout: PropTypes.func.isRequired,
        tooltipInfoGenerator: PropTypes.func.isRequired,
        tooltipTimeGenerator: PropTypes.func.isRequired,
        rotaDate: PropTypes.object.isRequired
    }

    constructor(props) {
      super(props);

      this.state = {
        rotasInfo: true,
        rotasTime: false
      };

      this.scrollOptions = {
        scrollX: true,
        scrollY: false,
        scrollbars: true,
        eventPassthrough: true,
      };
    }

    highlightControls(){
      let result = null;
      if(this.props.chartData.length > 0) {
        return (<div className="rota-overview-chart__controls">
          <span className="rota-overview-chart__controls-label">Highlight:&nbsp;</span>
          <button
            style={{ marginRight: '10px' }}
            className={`boss-button boss-button_type_small boss-button_role_highlight rota-overview-chart__controls-button ${
              this.state.rotasInfo ? 'boss-button_state_active' : ''
            }`}
            onClick={() => this.setState({ rotasInfo: true, rotasTime: false })}
          >
            Staff Counts
          </button>
          <button
            className={`boss-button boss-button_type_small boss-button_role_highlight rota-overview-chart__controls-button ${
              this.state.rotasTime ? 'boss-button_state_active' : ''
            }`}
            onClick={() => this.setState({ rotasInfo: false, rotasTime: true })}
          >
            Shift Info
          </button>
        </div>);
      }
    }

    render() {
        var self = this;
        var datum = this.props.chartData;
        const tooltipGenerator = this.state.rotasInfo ? this.props.tooltipInfoGenerator : this.props.tooltipTimeGenerator;
        const noDataMessage = this.props.noData || "There is no Data to display";
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
              classes: 'rota-overview-chart-tooltip',
              contentGenerator: tooltipGenerator,
            },
            reduceXTicks: false,
            noData: noDataMessage
        }

        const renderEnd = (chart) => {

            chart.multibar.dispatch.on("elementClick", (obj) => {
              this.props.onElementClick(obj);
            });
            chart.multibar.dispatch.on("elementMouseover", (obj) => {
                this.props.onElementMouseover(obj);
                // self.updateHoverIndicator();
            });
            chart.multibar.dispatch.on("elementMouseout", (obj) => {
                this.props.onElementMouseout(obj);
                // self.updateHoverIndicator();
            });
        }

        return(
          <div className="rota-overview-chart">
          { this.highlightControls() }
            <ReactIScroll iScroll={iScroll} options={this.scrollOptions}>
              <NVD3Chart
                  options={options}
                  type="multiBarChart"
                  datum={datum}
                  x="label"
                  y="value"
                  margin={{}}
                  renderEnd={renderEnd}/>
            </ReactIScroll>
          </div>
        )}

    getTickValues(){
        var tickValues = [];
        var startTime = this.props.rotaDate.startTime;
        for (var i=0; i< 25; i++) {
            var date = new Date(startTime.valueOf() + i * MILLISECONDS_PER_HOURS)
            tickValues.push(date.valueOf())
            tickValues.push(date.valueOf() + MILLISECONDS_PER_HOURS * .5)
        }
        tickValues.pop(); // remove the last one at 8:30 that's duplicated
        return tickValues;
    }
    updateHoverIndicator(){
        var svg = this.getChartSvgElement();
        var hoverBar = d3.select(svg).selectAll(".nv-bar.hover");
        var indicator = this.getHoverIndicator();
        
        if (hoverBar.empty()) {
            indicator.style("opacity", 0);
        } else {
            var x = convertTranslateToXY(hoverBar.attr("transform")).x;
            x += (hoverBar.attr("width") - HOVER_INDICATOR_WIDTH) / 2;
            var y = hoverBar.attr("y");

            indicator.attr({
                "transform": getTranslateTransform(x, y),
            });
            indicator.style("opacity", 0);
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
