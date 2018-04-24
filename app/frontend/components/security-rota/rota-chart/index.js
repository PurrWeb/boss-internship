import RotaChartInner from './rota-chart-inner';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import calculateChartBoundaries from './calculate-chart-boundaries';
import _ from 'underscore';

/**
This is a wrapper around the D3 rota chart that handles small state changes
like hover highlighting that don't work well with a full re-render of the chart
(due to e.g. mouseenter being re-triggered when a bar is replaced while under the cursor
... which in turn would cause a re-render).
 */
export default class RotaChart extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var chartBoundaries = calculateChartBoundaries(this.props.rotaShifts);

    return (
      <RotaChartInner
        rotaShifts={_(this.props.rotaShifts).sortBy(item => item.startsAt)}
        startTime={chartBoundaries.start}
        endTime={chartBoundaries.end}
        staff={this.props.staff}
        onShiftClick={this.props.onShiftClick}
      />
    );
  }
}

RotaChart.propTypes = {
  rotaShifts: PropTypes.array.isRequired,
  staff: PropTypes.array.isRequired,
  onShiftClick: PropTypes.func.isRequired,
};
