import React, { Component } from 'react';
import ClockInPeriodForm from './clockin-period-form';
import AcceptedClockInPeriod from './accepted-clockin-period';
import oFetch from 'o-fetch';

class ClockInPeriod extends Component {
  renderPeriodByStatus(period) {
    const status = oFetch(period, 'status');
    const id = oFetch(period, 'id');

    if (status === 'pending') {
      const initialValues = {
        reasonNote: oFetch(period, 'reasonNote'),
      };

      return (
        <ClockInPeriodForm
          initialValues={initialValues}
          period={period}
          form={`period-${id}`}
        />
      );
    }

    if (status === 'accepted') {
      return <AcceptedClockInPeriod period={period} />;
    }

    return null;
  }

  render() {
    const { period } = this.props;

    return (
      <div className="boss-hrc__shift">
        <div className="boss-time-shift">
          <div className="boss-time-shift__header">
            <h4 className="boss-time-shift__title">From/To</h4>
          </div>
          {this.renderPeriodByStatus(period)}
        </div>
      </div>
    );
  }
}

export default ClockInPeriod;
