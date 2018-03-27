import React from 'react';
import d3 from 'd3';
import utils from '~/lib/utils';
import makeRotaHoursXAxis from '~/lib/make-rota-hours-x-axis';
import iScroll from 'boss-iscroll';
import ReactIScroll from 'react-iscroll';

var scrollOptions = {
  scrollX: true,
  scrollY: false,
  scrollbars: true,
  // mouseWheel: true,
  interactiveScrollbars: true,
  shrinkScrollbars: 'scale',
  fadeScrollbars: false,
  eventPassthrough: true,
  click: true,
};
var innerWidth = 480;
var innerHeight = 80;
var padding = 50;
var paddingRight = 50;
var labelSpacing = 50;
var barHeight = 25;
var outerWidth = innerWidth + padding + paddingRight;
var outerHeight = innerHeight + padding * 2;

const ICON_ROLE_MANAGER =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjk3IDI5NyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI5NyAyOTciPgogIDxnPgogICAgPHBhdGggZD0iTTE0OC41MSwxMTcuMjE2YzMyLjMxNywwLDU4LjYwOC0yNi4yOTEsNTguNjA4LTU4LjYwOFMxODAuODI3LDAsMTQ4LjUxLDBjLTMyLjMxNywwLTU4LjYwOCwyNi4yOTEtNTguNjA4LDU4LjYwOCAgIFMxMTYuMTkzLDExNy4yMTYsMTQ4LjUxLDExNy4yMTZ6IiBmaWxsPSIjZGQwMDAwIi8+CiAgICA8cGF0aCBkPSJtMjI3LjE1NCwxNDUuNjE4Yy0wLjAyNS0wLjAwOC0wLjA3My0wLjAyNi0wLjA5OC0wLjAzMi03LjYzMS0xLjg2NC0zMC45OTktNS4xMzMtMzAuOTk5LTUuMTMzLTIuNjM4LTAuODEyLTUuNDU3LDAuNTg1LTYuNDA2LDMuMTg4bC0zNS4xNzQsOTYuNTA5Yy0yLjAyOSw1LjU2Ny05LjkwMyw1LjU2Ny0xMS45MzIsMGwtMzUuMTc0LTk2LjUwOWMtMC43NjYtMi4xMDItMi43NS0zLjQyLTQuODc2LTMuNDItMC41MDQsMC0yNC41MzEsMy4zNjktMzIuNTMsNS4zNTgtMjEuODU4LDUuNDM1LTM1LjY0NSwyNi45MjktMzUuNjQ1LDQ5LjMyOXY4MC4zMDJjMCwxMi4wMzQgOS43NTYsMjEuNzkgMjEuNzksMjEuNzloMTg0Ljc4MmMxMi4wMzQsMCAyMS43OS05Ljc1NiAyMS43OS0yMS43OXYtODAuNTY5Yy0wLjAwMS0yMi4zMDMtMTQuMzI4LTQyLjA5Ni0zNS41MjgtNDkuMDIzeiIgZmlsbD0iI2RkMDAwMCIvPgogICAgPHBhdGggZD0ibTE2MS43NzUsMTM4LjYxM2MtMS40MDQtMS41My0zLjQ1Ni0yLjI5OS01LjUzMi0yLjI5OWgtMTUuNDg1Yy0yLjA3NiwwLTQuMTI5LDAuNzctNS41MzIsMi4yOTktMi4xNzMsMi4zNjgtMi40ODksNS43ODktMC45NDYsOC40NjJsOC4yNzgsMTIuNDc5LTMuODc1LDMyLjY5IDcuNjMxLDIwLjNjMC43NDQsMi4wNDIgMy42MzEsMi4wNDIgNC4zNzUsMGw3LjYzMS0yMC4zLTMuODc1LTMyLjY5IDguMjc4LTEyLjQ3OWMxLjU0MS0yLjY3MyAxLjIyNS02LjA5NC0wLjk0OC04LjQ2MnoiIGZpbGw9IiNkZDAwMDAiLz4KICA8L2c+Cjwvc3ZnPgo=';
export default class HoursChartUi extends React.Component {
  render() {
    return (
      <div className="hours-chart">
        <div className="hours-chart__inner">
          <ReactIScroll iScroll={iScroll} options={scrollOptions}>
            <div className="hours-chart__content">
              <svg ref={el => (this.el = el)} />
            </div>
          </ReactIScroll>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.renderChart();
  }

  componentWillReceiveProps(newProps) {
    var currentPropsExceptInteractionState = { ...this.props };
    delete currentPropsExceptInteractionState.interactionState;
    var newPropsExceptInteractionState = { ...newProps };
    delete newPropsExceptInteractionState.interactionState;
    if (
      !utils.deepEqualTreatingFunctionsAsStrings(
        currentPropsExceptInteractionState,
        newPropsExceptInteractionState,
      )
    ) {
      this.needsFullRerender = true;
    }
  }
  componentDidUpdate() {
    if (this.needsFullRerender) {
      this.renderChart();
      this.needsFullRerender = false;
    } else {
      this.updateChartInteractions();
    }
  }
  renderChart() {
    var self = this;
    this.el.innerHTML = '';

    var chart = this.getChart();
    chart.attr('width', outerWidth);
    chart.attr('height', outerHeight);

    var xScale = this.getXScale();

    var chartContent = chart
      .append('g')
      .attr('transform', 'translate(' + 60 + ', 0)');

    this.renderXAxis({ chartContent, xScale });
    this.renderHoursAcceptanceIntervals({ chartContent, xScale });
    this.renderClockedIntervals({ chartContent, xScale });
    this.renderRotaedIntervals({ chartContent, xScale });
    this.renderLaneLabels({ chart });
    this.renderEvents({ chartContent, xScale });
  }
  getXScale() {
    return d3.scale
      .linear()
      .domain([0, 24])
      .range([0, innerWidth]);
  }
  getChart() {
    return d3.select(this.el);
  }
  renderEvents({ chartContent, xScale }) {
    var group = chartContent.append('g');
    var lineContainers = group
      .selectAll('g')
      .data(this.props.events)
      .enter()
      .append('g')
      .attr('transform', function(event) {
        var x = xScale(event.timeOffset) + 20;
        return 'translate(' + x + ',55)';
      });

    lineContainers
      .append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('stroke', function(event) {
        return {
          clock_in: 'black',
          clock_out: 'black',
          start_break: 'red',
          end_break: 'red',
        }[event.type];
      })
      .attr('stroke-width', function(event) {
        return 3;
      })
      .attr('y1', -2)
      .attr('y2', 2 + barHeight);

    var clockInOutContainers = lineContainers.filter(function(event) {
      return event.type === 'clock_in' || event.type === 'clock_out';
    });

    clockInOutContainers
      .append('line')
      .attr('y1', -2)
      .attr('y2', -2)
      .classed('hours-confirmation-chart__clock-in-out-markers', true);

    clockInOutContainers
      .append('line')
      .attr('y1', 25)
      .attr('y2', 25)
      .classed('hours-confirmation-chart__clock-in-out-markers', true);

    var clockInOutMarkers = lineContainers.selectAll(
      '.hours-confirmation-chart__clock-in-out-markers',
    );

    clockInOutMarkers
      .attr('x1', function(event) {
        return {
          clock_in: -1.5,
          clock_out: -6,
        }[event.type];
      })
      .attr('x2', function(event) {
        return {
          clock_in: 8,
          clock_out: 2,
        }[event.type];
      })
      .attr('stroke', 'black')
      .attr('stroke-width', 3);

    var eventIndicator = lineContainers.filter(function(event) {
      return event.role === 'manager';
    });

    eventIndicator.append('g').classed('hours-chart__event-indicator', true);

    var eventIndicatorMarker = eventIndicator.selectAll(
      '.hours-chart__event-indicator',
    );

    eventIndicatorMarker
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 12)
      .attr('r', 9)
      .attr('fill', 'white')
      .attr('stroke', function(event) {
        return {
          clock_in: 'black',
          clock_out: 'black',
          start_break: 'red',
          end_break: 'red',
        }[event.type];
      })
      .attr('stroke-width', 1)
      .style('shape-rendering', 'geometricPrecision');

    var eventIndicatorIcon = eventIndicator.selectAll(
      '.hours-chart__event-indicator',
    );

    eventIndicatorIcon
      .append('svg:image')
      .attr('width', 12)
      .attr('height', 12)
      .attr('x', -6)
      .attr('y', 5)
      .attr('xlink:href', function(event) {
        return {
          manager: ICON_ROLE_MANAGER,
        }['manager'];
      });
  }
  renderHoursAcceptanceIntervals({ chartContent, xScale }) {
    this.renderIntervals({
      chart: chartContent,
      xScale,
      intervals: this.props.hoursAcceptanceIntervals,
      lane: 'amended',
    });
  }
  renderIntervals({ chart, xScale, intervals, lane }) {
    var y = {
      amended: 100,
      clocked: 55,
      rotaed: 10,
    }[lane];
    var intervalGroup = chart
      .append('g')
      .selectAll('g')
      .data(intervals)
      .enter()
      .append('g')
      .attr('transform', function(interval, i) {
        var x = xScale(interval.startOffsetInHours) + padding - 30;
        return 'translate(' + x + ',' + y + ')';
      })
      .attr('class', function(interval) {
        var classes = [];
        if (interval.type == 'rotaed') {
          classes.push('hours-chart__rotaed-interval');
        }
        return classes.join(' ');
      });

    var rectangle = intervalGroup
      .append('rect')
      .attr('width', function(interval, i) {
        var intervalLengthInHours =
          interval.endOffsetInHours - interval.startOffsetInHours;
        return xScale(intervalLengthInHours);
      })
      .attr('height', barHeight)
      .attr('class', function(interval) {
        var classes = ['hours-chart__interval'];

        if (interval.type === 'hours') {
          classes.push('hours-chart__' + lane + '-interval--hours');
        }
        if (interval.type === 'break') {
          classes.push('hours-chart__' + lane + '-interval--break');
        }

        return classes.join(' ');
      });

    if (lane === 'clocked') {
      rectangle
        .on('mouseenter', interval => {
          this.props.onHoveredIntervalChange(interval);
        })
        .on('mouseout', interval => {
          this.props.onHoveredIntervalChange(null);
        });
    }

    intervalGroup
      .append('text')
      .attr('transform', 'translate(3, 18)')
      .text(function(interval) {
        return interval.label;
      });
  }
  updateChartInteractions() {
    this.highlightHoveredInterval();
    this.renderToolTip();
  }
  highlightHoveredInterval() {
    var chart = this.getChart();
    var hoveredInterval = this.props.interactionState.hoveredInterval;

    chart
      .selectAll('.hours-chart__interval')
      .attr('opacity', 1)
      .filter(function(interval) {
        return interval == hoveredInterval;
      })
      .attr('opacity', 0.8);
  }
  renderToolTip() {
    var xScale = this.getXScale();
    var chart = this.getChart();
    var hoveredInterval = this.props.interactionState.hoveredInterval;
    const tooltipWidth = 120;

    if (hoveredInterval) {
      var intervalWidth =
        xScale(hoveredInterval.endOffsetInHours) -
        xScale(hoveredInterval.startOffsetInHours);
      var x =
        xScale(hoveredInterval.startOffsetInHours) +
        intervalWidth / 2 +
        padding +
        labelSpacing -
        tooltipWidth / 2;

      var g = chart
        .append('g')
        .attr('transform', 'translate(' + x + ', 4)')
        .attr('class', 'hours-chart__tooltip');

      g
        .append('rect')
        .attr('width', tooltipWidth)
        .attr('height', 30);

      var arrow = g
        .append('polygon')
        .attr('points', '0,0 5,5 10,0')
        .attr('fill', 'black')
        .attr(
          'transform',
          'translate(' + (tooltipWidth / 2 - 10 / 2) + ', 30)',
        );

      g
        .append('text')
        .text(hoveredInterval.tooltipLabel)
        .attr('fill', 'white')
        .attr('transform', 'translate(4, 20)');
    } else {
      chart.selectAll('.hours-chart__tooltip').remove();
    }
  }
  renderLaneLabels({ chart }) {
    var group = chart
      .append('g')
      .attr('transform', 'translate(' + 60 + ',0)')
      .attr('style', 'font-size: .85em');
    group
      .append('text')
      .text('Rotaed')
      .attr('transform', 'translate(0, 25)');
    group
      .append('text')
      .text('Clocked')
      .attr('transform', 'translate(0, 75)');
    group
      .append('text')
      .text('Amended')
      .attr('transform', 'translate(0, 125)');
    group.selectAll('text').attr('text-anchor', 'end');
  }
  renderXAxis({ chartContent, xScale }) {
    var xAxis = makeRotaHoursXAxis(xScale);
    chartContent
      .append('g')
      .attr('transform', 'translate(20, 150)')
      .attr('class', 'axis')
      .call(xAxis);
  }
  renderRotaedIntervals({ chartContent, xScale }) {
    this.renderIntervals({
      chart: chartContent,
      xScale,
      intervals: this.props.rotaedIntervals,
      lane: 'rotaed',
    });
  }
  renderClockedIntervals({ chartContent, xScale }) {
    this.renderIntervals({
      chart: chartContent,
      xScale,
      intervals: this.props.clockedIntervals,
      lane: 'clocked',
    });
  }
}
