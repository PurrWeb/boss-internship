import React, { Component } from 'react';
import _ from 'lodash';
import oFetch from 'o-fetch';

import ClockInPeriods from '../clockin-periods';
import ClockInPeriod from '../clockin-periods/clockin-period';
import HoursChart from '../hours-chart';
import ClockOutButton from './clock-out-button';
import { STATUSES, STATUS_CLASSES } from './index';

class StaffMemberMainSide extends Component {
  renderNotes(clockInNotes) {
    return (
      <div className="boss-notes boss-notes_page_hrc">
        <h4 className="boss-notes__label">Notes</h4>
        <div className="boss-notes__content">
          <div className="boss-notes__content-inner">
            <ul className="boss-notes__list">
              {clockInNotes.map(note => {
                return <li key={oFetch(note, 'id')} className="boss-notes__item">
                  <span className="boss-notes__link">{oFetch(note, 'note')}</span>
                </li>
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }

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
      pageType,
      venue,
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
          {pageType === 'overview' ? (
            <p className="boss-hrc__venue">
              <span className="boss-hrc__venue-text">
                {oFetch(venue, 'name')}
              </span>
            </p>
          ) : (
            <p className="boss-hrc__date">
              <span className="boss-hrc__date-text">{clockInDateFormated}</span>
            </p>
          )}
        </div>
        <div className="boss-hrc__content">
          <div className="boss-hrc__info">
            <HoursChart
              rotaDate={rotaDate}
              rotaedShifts={rotaedShifts}
              hoursAcceptancePeriods={hoursAcceptancePeriods}
              clockedClockInPeriods={clockInPeriods}
              clockInEvents={clockInEvents}
            />
            {this.renderNotes(this.props.clockInNotes)}
          </div>
          {status === 'clocked_out' && (
            <ClockInPeriods
              periods={hoursAcceptancePeriods}
              onAddNewAcceptancePeriod={this.props.onAddNewAcceptancePeriod}
              onDoneClick={this.props.onDoneClick}
              pageType={pageType}
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
