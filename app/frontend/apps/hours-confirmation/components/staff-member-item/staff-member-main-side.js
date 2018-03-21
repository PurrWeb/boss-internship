import React, { Component } from 'react';
import _ from 'lodash';

import ClockInPeriods from '../clockin-periods';
import ClockInPeriod from '../clockin-periods/clockin-period';
import HoursChart from '../hours-chart';
import ClockOutButton from './clock-out-button';
import { STATUSES, STATUS_CLASSES } from './index';

class StaffMemberMainSide extends Component {
  render() {
    const {
      status,
      mClockInDate,
      staffMemberId,
      clockInPeriods,
      rotaDate,
      rotaedShifts,
      hoursAcceptancePeriods,
      clockInEvents,
      timeDiff,
      rotaedStats,
      hoursAcceptanceStats,
    } = this.props;

    const clockInDateFormated = mClockInDate.format('dddd, DD MMM YYYY');

    return (
      <div className="boss-hrc__main">
        <div className="boss-hrc__header">
          <h3 className="boss-hrc__status">
            <span className="boss-hrc__status-text">Status</span>
            <span
              className={`boss-button boss-button_type_small boss-button_status_${
                STATUS_CLASSES[status]
              } boss-hrc__status-label`}
            >
              {STATUSES[status]}
            </span>
          </h3>
          <p className="boss-hrc__date">
            <span className="boss-hrc__date-text">{clockInDateFormated}</span>
          </p>
        </div>
        <div className="boss-hrc__content">
          <HoursChart
            rotaDate={rotaDate}
            rotaedShifts={rotaedShifts}
            hoursAcceptancePeriods={hoursAcceptancePeriods}
            clockedClockInPeriods={clockInPeriods}
            clockInEvents={clockInEvents}
          />
          {status === 'clocked_out' && (
            <ClockInPeriods
              periods={hoursAcceptancePeriods}
              onAddNewAcceptancePeriod={this.props.onAddNewAcceptancePeriod}
              periodRenderer={period => (
                <ClockInPeriod
                  onUnacceptPeriod={this.props.onUnacceptPeriod}
                  onDeletePeriod={this.props.onDeletePeriod}
                  onPeriodDataChange={this.props.onPeriodDataChange}
                  onAcceptPeriod={this.props.onAcceptPeriod}
                  onAddBreak={this.props.onAddBreak}
                  hoursAcceptanceBreaks={this.props.hoursAcceptanceBreaks}
                  staffMemberId={staffMemberId}
                  period={period}
                  rotaedStats={rotaedStats}
                  hoursAcceptanceStats={hoursAcceptanceStats}
                  timeDiff={timeDiff}
                />
              )}
            />
          )}
          <ClockOutButton status={status} onClockOut={this.props.onClockOut} />
        </div>
      </div>
    );
  }
}

export default StaffMemberMainSide;
