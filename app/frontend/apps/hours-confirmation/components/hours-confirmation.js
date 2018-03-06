import React, { Component } from 'react';
import oFetch from 'o-fetch';

import getHoursPeriodStats from '~/lib/get-hours-period-stats';
import RotaDate from '~/lib/rota-date';
import { addZeroToNumber } from '../selectors';

import {
  SimpleDashboard,
  DashboardActions,
} from '~/components/boss-dashboards';

import safeMoment from '~/lib/safe-moment';

import StaffMembersList from './staff-members-list';
import StaffMemberItem from './staff-member-item';

import StaffMemberLeftSide from './staff-member-item/staff-member-left-side';
import StaffMemberMainSide from './staff-member-item/staff-member-main-side';

function timeObjectDiff(rotaed, accepted) {
  const rotaedSeconds = rotaed.hours * 60 * 60 + rotaed.minutes * 60;
  const acceptedSeconds = accepted.hours * 60 * 60 + accepted.minutes * 60;
  const secondsDiff = Math.abs(rotaedSeconds - acceptedSeconds);
  const hours = Math.trunc(secondsDiff / 60 / 60);
  const minutes = Math.trunc((secondsDiff / 60) % 60);
  const sign =
    rotaedSeconds !== acceptedSeconds
      ? rotaedSeconds < acceptedSeconds ? '+' : '-'
      : '';
  const zeroHours = addZeroToNumber(hours);
  const zeroMinutes = addZeroToNumber(minutes);
  return {
    sign,
    hours,
    minutes,
    zeroHours,
    zeroMinutes,
    full: `${sign}${zeroHours}h${zeroMinutes}m`,
  };
}

class HoursConfirmation extends Component {
  _handleViewByDate = () => {};

  _renderStaffMemberItem({ date, periods }) {
    const clockInPeriods = oFetch(periods, 'clockInPeriods');
    const hoursAcceptancePeriods = oFetch(periods, 'hoursAcceptancePeriods');
    const hoursAcceptanceStats = oFetch(periods, 'hoursAcceptanceStats');
    const clockedStats = oFetch(periods, 'clockedStats');
    const rotaedStats = oFetch(periods, 'rotaedStats');
    const rotaedShifts = oFetch(periods, 'rotaedShifts');
    const clockInEvents = oFetch(periods, 'clockInEvents');
    const staffMember = oFetch(periods, 'staffMember');
    const status = clockInPeriods[clockInPeriods.length - 1].status;
    const staffType = this.props.staffTypes
      .find(x => x.get('id') === oFetch(staffMember, 'staffType'))
      .toJS();
    const staffMemberId = oFetch(staffMember, 'id');
    const fullName = oFetch(staffMember, 'fullName');
    const avatarUrl = oFetch(staffMember, 'avatarUrl');
    const mClockInDate = safeMoment.uiDateParse(date);
    const staffTypeName = oFetch(staffType, 'name');
    const staffTypeColor = oFetch(staffType, 'color');

    const timeDiff = timeObjectDiff(rotaedStats, hoursAcceptanceStats);

    return (
      <StaffMemberItem>
        <StaffMemberLeftSide
          status={status}
          fullName={fullName}
          avatarUrl={avatarUrl}
          staffTypeName={staffTypeName}
          staffTypeColor={staffTypeColor}
          clockedStats={clockedStats}
          rotaedStats={rotaedStats}
          hoursAcceptanceStats={hoursAcceptanceStats}
          timeDiff={timeDiff}
        />
        <StaffMemberMainSide
          staffMemberId={staffMemberId}
          status={status}
          mClockInDate={mClockInDate}
          clockInPeriods={clockInPeriods}
          clockInPeriods={clockInPeriods}
          rotaedShifts={rotaedShifts}
          clockInEvents={clockInEvents}
          hoursAcceptancePeriods={hoursAcceptancePeriods}
          rotaDate={
            new RotaDate({
              dateOfRota: mClockInDate.toDate(),
            })
          }
        />
      </StaffMemberItem>
    );
  }

  render() {
    const { clockInOutData, staffMembers } = this.props;
    return (
      <div>
        <SimpleDashboard title="Hours confirmation">
          <DashboardActions>
            <button
              className="boss-button boss-button_role_calendar boss-page-dashboard__button"
              onClick={this._handleViewByDate}
            >
              View by date
            </button>
          </DashboardActions>
        </SimpleDashboard>
        <StaffMembersList
          clockInOutData={clockInOutData}
          staffMembers={staffMembers}
          itemRenderer={({ date, periods }) =>
            this._renderStaffMemberItem({ date, periods })
          }
        />
      </div>
    );
  }
}

export default HoursConfirmation;
