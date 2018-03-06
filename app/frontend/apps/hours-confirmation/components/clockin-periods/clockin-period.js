import React, { Component } from 'react';
import ClockInPeriodForm from './clockin-period-form';

class CLockInPeriod extends Component {
  render() {
    const { period } = this.props;
    return (
      <div className="boss-hrc__shift">
        <div className="boss-time-shift">
          <div className="boss-time-shift__header">
            <h4 className="boss-time-shift__title">From/To</h4>
          </div>
        </div>
      </div>
    );
  }
}

export default CLockInPeriod;
