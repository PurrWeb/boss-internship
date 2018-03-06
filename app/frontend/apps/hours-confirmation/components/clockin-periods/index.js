import React, { Component } from 'react';
import ClockInPeriod from './clockin-period';

class ClockInPeriods extends Component {
  renderPeriods(periods) {
    return periods.map(period => {
      return React.cloneElement(this.props.periodRenderer(period), {
        key: period.id,
      });
    });
  }

  render() {
    return (
      <div className="boss-hrc__shifts">
        {this.renderPeriods(this.props.periods)}
      </div>
    );
  }
}

export default ClockInPeriods;
