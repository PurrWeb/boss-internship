import React, { Component } from 'react';
import oFetch from 'o-fetch';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { appRoutes } from '~/lib/routes';

momentDurationFormatSetup(moment);

function renderWeekHours(hours) {
  return (
    <div>
      <b className="boss-user-summary__marked boss-user-summary__marked_role_alert">{`(${moment
        .duration(hours, 'minutes')
        .format('*h[h] m[m]', { trim: 'both', useGrouping: false })})`}</b>
    </div>
  );
}
export default class TimeDodgerInfo extends Component {
  render() {
    const [dodger, startDate, endDate] = oFetch(this.props, 'dodger', 'startDate', 'endDate');
    const [
      staffMemberId,
      fullName,
      staffType,
      venue,
      acceptedHours,
      acceptedBreaks,
      paidHolidays,
      owedHours,
      hours,
    ] = oFetch(
      dodger,
      'staffMemberId',
      'fullName',
      'staffType',
      'venue',
      'acceptedHours',
      'acceptedBreaks',
      'paidHolidays',
      'owedHours',
      'hours',
    );

    return (
      <div className="boss-user-summary__content">
        <div className="boss-user-summary__header">
          <h2 className="boss-user-summary__name">
            {fullName}
            {renderWeekHours(hours)}
          </h2>
        </div>
        <ul className="boss-user-summary__review-list">
          <li className="boss-user-summary__review-item">
            <span className="boss-user-summary__review-label">Staff Type: </span>
            <span className="boss-user-summary__review-val boss-user-summary__review-val_marked">
              {oFetch(staffType, 'name')}
            </span>
          </li>
          <li className="boss-user-summary__review-item">
            <span className="boss-user-summary__review-label">Master Venue: </span>
            <span className="boss-user-summary__review-val boss-user-summary__review-val_marked">{venue}</span>
          </li>
          <li className="boss-user-summary__review-item">
            <span className="boss-user-summary__review-label">Accepted: </span>
            <a
              className="boss-user-summary__review-val"
              target="_blank"
              href={appRoutes.staffMemberProfileShifts({ startDate, endDate, staffMemberId: staffMemberId })}
            >
              {acceptedHours === 0
                ? `0h`
                : moment.duration(acceptedHours, 'minutes').format('*h[h] m[m]', { trim: 'both', useGrouping: false })}
            </a>
          </li>
          <li className="boss-user-summary__review-item">
            <span className="boss-user-summary__review-label">Breaks: </span>
            <a
              className="boss-user-summary__review-val"
              target="_blank"
              href={appRoutes.staffMemberProfileShifts({ startDate, endDate, staffMemberId: staffMemberId })}
            >
              {acceptedBreaks === 0
                ? `0h`
                : moment.duration(acceptedBreaks, 'minutes').format('*h[h] m[m]', { trim: 'both', useGrouping: false })}
            </a>
          </li>
          <li className="boss-user-summary__review-item">
            <span className="boss-user-summary__review-label">Paid holidays: </span>
            <a
              className="boss-user-summary__review-val"
              target="_blank"
              href={appRoutes.staffMemberProfileHolidays({ startDate, endDate, staffMemberId: staffMemberId })}
            >
              {paidHolidays === 0
                ? `0h`
                : moment.duration(paidHolidays, 'minutes').format('*h[h] m[m]', { trim: 'both', useGrouping: false })}
            </a>
          </li>
          <li className="boss-user-summary__review-item">
            <span className="boss-user-summary__review-label">Owed hours: </span>
            <a
              className="boss-user-summary__review-val"
              target="_blank"
              href={appRoutes.staffMemberProfileHolidays({ startDate, endDate, staffMemberId: staffMemberId })}
            >
              {owedHours === 0
                ? `0h`
                : moment.duration(owedHours, 'minutes').format('*h[h] m[m]', { trim: 'both', useGrouping: false })}
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

TimeDodgerInfo.defaultProps = {
  onMarkHandledClick: null,
};
