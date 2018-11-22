import React, { Component } from 'react';
import ClockInPeriodForm from './clockin-period-form';
import AcceptedClockInPeriod from './accepted-clockin-period';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';

function dropStartsEndsTimeSeconds(items) {
  return items.map(item => {
    if (!item.startsAt || !item.endsAt) {
      throw new Error(`Entry doesn't have a startsAt or endsAt key`);
    }
    return {
      ...item,
      startsAt: safeMoment.iso8601Parse(item.startsAt).second(0),
      endsAt: safeMoment.iso8601Parse(item.endsAt).second(0),
    };
  });
}

class ClockInPeriod extends Component {
  renderPeriodByStatus(period) {
    const status = oFetch(period, 'status');
    const venueId = oFetch(period, 'venueId');
    const id = oFetch(period, 'id');
    const frontendId = oFetch(period, 'frontendId');
    const startsAt = oFetch(period, 'startsAt');
    const endsAt = oFetch(period, 'endsAt');
    const reasonNote = oFetch(period, 'reasonNote');
    const breaks = oFetch(period, 'breaks');
    const date = oFetch(period, 'date');
    const staffMember = oFetch(period, 'staffMember');
    const rotaedStats = oFetch(this.props, 'rotaedStats');
    const hoursAcceptanceStats = oFetch(this.props, 'hoursAcceptanceStats');
    if (status === 'pending') {
      const initialValues = {
        id: id || null,
        date,
        staffMember,
        frontendId,
        startsAt,
        endsAt,
        reasonNote,
        breaks: dropStartsEndsTimeSeconds(breaks),
        venueId,
      };

      return (
        <ClockInPeriodForm
          initialValues={initialValues}
          onAcceptPeriod={this.props.onAcceptPeriod}
          onPeriodDataChange={this.props.onPeriodDataChange}
          onDeletePeriod={this.props.onDeletePeriod}
          onAddBreak={this.props.onAddBreak}
          period={period}
          hoursAcceptanceStats={hoursAcceptanceStats}
          rotaedStats={rotaedStats}
          timeDiff={oFetch(this.props, 'timeDiff')}
          form={`period-${this.props.staffMemberId}-${date}-${
            this.props.index
          }`}
        />
      );
    }

    if (status === 'accepted') {
      return (
        <AcceptedClockInPeriod
          onUnacceptPeriod={this.props.onUnacceptPeriod}
          period={period}
        />
      );
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
