import React, { Component } from 'react';

class ClockInPeriods extends Component {
  renderPeriods(periods) {
    return periods.map((period, index) => {
      return React.cloneElement(this.props.periodRenderer(period), {
        key: index,
        index,
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
