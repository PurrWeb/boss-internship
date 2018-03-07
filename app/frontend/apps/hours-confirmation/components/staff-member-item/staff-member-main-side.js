import React, { Component } from 'react';
import ClockInPeriods from '../clockin-periods';
import ClockInPeriod from '../clockin-periods/clockin-period';
import HoursChart from '../hours-chart';
import _ from 'lodash';

const STATUSES = {
  clocked_in: 'CLOCKED IN',
  clocked_out: 'CLOCKED OUT',
};

function convertClockInPeriodToIntervals(denormalizedHoursPeriod) {
  var breaksOrderedByStartTime = _.sortBy(
    denormalizedHoursPeriod.breaks,
    'startsAt',
  );

  var lastTime = denormalizedHoursPeriod.startsAt;
  var intervals = [];

  breaksOrderedByStartTime.forEach(function(breakItem) {
    intervals.push({
      startsAt: lastTime,
      endsAt: breakItem.startsAt,
      type: 'hours',
    });
    if (breakItem.endsAt) {
      intervals.push({
        startsAt: breakItem.startsAt,
        endsAt: breakItem.endsAt,
        type: 'break',
      });
      lastTime = breakItem.endsAt;
    }
  });

  if (denormalizedHoursPeriod.endsAt) {
    intervals.push({
      startsAt: lastTime,
      endsAt: denormalizedHoursPeriod.endsAt,
      type: 'hours',
    });
  }
  return intervals;
}

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
    } = this.props;

    const clockInDateFormated = mClockInDate.format('dddd, DD MMM YYYY');

    return (
      <div className="boss-hrc__main">
        <div className="boss-hrc__header">
          <h3 className="boss-hrc__status">
            <span className="boss-hrc__status-text">Status</span>
            <span
              className={`boss-button boss-button_type_small boss-button_role_alert boss-hrc__status-label`}
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
          <ClockInPeriods
            periods={hoursAcceptancePeriods}
            periodRenderer={period => <ClockInPeriod period={period} />}
          />
        </div>
      </div>
    );
  }
}

export default StaffMemberMainSide;
