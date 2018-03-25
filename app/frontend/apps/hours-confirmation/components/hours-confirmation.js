import React, { Component } from 'react';
import oFetch from 'o-fetch';
import uuid from 'uuid/v1';

import RotaDate from '~/lib/rota-date';
import { addZeroToNumber, formattedTime } from '../selectors';

import {
  SimpleDashboard,
  DashboardActions,
  DashboardDateSelect,
} from '~/components/boss-dashboards';

import { appRoutes } from '~/lib/routes';

import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';

import StaffMembersList from './staff-members-list';
import StaffMemberItem from './staff-member-item';

import StaffMemberLeftSide from './staff-member-item/staff-member-left-side';
import StaffMemberMainSide from './staff-member-item/staff-member-main-side';

export const timeObjectDiff = (rotaed, accepted) => {
  const diff = rotaed - accepted;

  const sign = rotaed !== accepted ? (rotaed < accepted ? '+' : '-') : '';
  return {
    sign,
    full: `${sign}${formattedTime(diff)}`,
  };
}

class HoursConfirmation extends Component {
  handleUnacceptPeriod = period => {
    return this.props.actions.unacceptPeriodAction(period);
  };

  handleDeletePeriod = values => {
    return this.props.actions.deletePeriodAction(values.toJS());
  };

  handlePeriodDataChange = periodData => {
    return this.props.actions.updatePeriodData(periodData);
  };

  handleAcceptPeriod = period => {
    return this.props.actions.acceptPeriodAction(period);
  };

  handleAddNewAcceptancePeriod = data => {
    return this.props.actions.addNewAcceptancePeriodAction(data);
  };

  getNewHoursDefaultTimes(hoursAcceptancePeriods, rotaDate) {
    if (hoursAcceptancePeriods.length === 0) {
      return {
        startsAt: rotaDate.getDateFromShiftStartTime(9, 0),
        endsAt: rotaDate.getDateFromShiftStartTime(10, 0),
      };
    }

    const lastExitingHours =
      hoursAcceptancePeriods[hoursAcceptancePeriods.length - 1];

    const previousShiftHoursOffset = rotaDate.getHoursSinceStartOfDay(
      safeMoment.iso8601Parse(lastExitingHours.endsAt).toDate(),
    );

    let newHoursStartOffset = previousShiftHoursOffset + 1;
    let newHoursEndOffset = newHoursStartOffset + 1;

    newHoursStartOffset = utils.containNumberWithinRange(newHoursStartOffset, [
      0,
      23,
    ]);

    newHoursEndOffset = utils.containNumberWithinRange(newHoursEndOffset, [
      0,
      23,
    ]);

    return {
      startsAt: rotaDate.getDateNHoursAfterStartTime(newHoursStartOffset),
      endsAt: rotaDate.getDateNHoursAfterStartTime(newHoursEndOffset),
    };
  }

  handleDateChange = ({ date, venueId }) => {
    location.href = appRoutes.hoursConfirmationDayPage({
      venueId,
      date,
    });
  };

  _renderStaffMemberItem({ date, periods }) {
    const clockInPeriods = oFetch(periods, 'clockInPeriods');
    const hoursAcceptancePeriods = oFetch(periods, 'hoursAcceptancePeriods');
    const hoursAcceptanceStats = oFetch(periods, 'hoursAcceptanceStats');
    const hoursAcceptanceBreaksStats = oFetch(
      periods,
      'hoursAcceptanceBreaksStats',
    );
    const pageOptionsJs = this.props.pageOptions.toJS();
    const pageType = oFetch(pageOptionsJs, 'pageType');
    const venueId = oFetch(periods, 'venueId');
    const venue = this.props.getVenueById(venueId);

    const hoursAcceptanceBreaks = oFetch(this.props, 'hoursAcceptanceBreaks');

    const clockedStats = oFetch(periods, 'clockedStats');
    const clockedBreaksStats = oFetch(periods, 'clockedBreaksStats');
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

    const timeDiff = timeObjectDiff(
      rotaedStats,
      hoursAcceptanceStats - hoursAcceptanceBreaksStats,
    );

    const rotaDate = new RotaDate({
      dateOfRota: mClockInDate.toDate(),
    });

    const newStartsEndsTime = this.getNewHoursDefaultTimes(
      hoursAcceptancePeriods,
      rotaDate,
    );

    return (
      <StaffMemberItem>
        <StaffMemberLeftSide
          status={status}
          fullName={fullName}
          avatarUrl={avatarUrl}
          staffTypeName={staffTypeName}
          staffTypeColor={staffTypeColor}
          clockedStats={clockedStats}
          clockedBreaksStats={clockedBreaksStats}
          rotaedStats={rotaedStats}
          hoursAcceptanceStats={hoursAcceptanceStats}
          hoursAcceptanceBreaksStats={hoursAcceptanceBreaksStats}
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
          hoursAcceptanceBreaks={hoursAcceptanceBreaks}
          hoursAcceptanceStats={hoursAcceptanceStats}
          rotaDate={rotaDate}
          timeDiff={timeDiff}
          venue={venue.toJS()}
          pageType={pageType}
          rotaedStats={rotaedStats}
          onUnacceptPeriod={this.handleUnacceptPeriod}
          onAcceptPeriod={this.handleAcceptPeriod}
          onDeletePeriod={this.handleDeletePeriod}
          onPeriodDataChange={this.handlePeriodDataChange}
          onClockOut={() =>
            this.props.actions.clockOutAction({
              date,
              staffMemberId,
            })
          }
          onAddNewAcceptancePeriod={() =>
            this.handleAddNewAcceptancePeriod({
              date,
              staffMemberId,
              newStartsEndsTime,
              frontendId: uuid(),
            })
          }
        />
      </StaffMemberItem>
    );
  }

  render() {
    const { clockInOutData, staffMembers, pageOptions } = this.props;
    const pageOptionsJs = pageOptions.toJS();
    const date = oFetch(pageOptionsJs, 'date');
    const venueId = oFetch(pageOptionsJs, 'venueId');
    const title = oFetch(pageOptionsJs, 'title');
    const url = oFetch(pageOptionsJs, 'url');
    const pageType = oFetch(pageOptionsJs, 'pageType');

    return (
      <div>
        {pageType === 'overview' && (
          <SimpleDashboard title={title} />
        )}
        {pageType === 'current' && (
          <SimpleDashboard title={title}>
            <DashboardActions>
              <a
                href={url}
                className="boss-button boss-button_role_calendar boss-page-dashboard__button"
              >
                View by date
              </a>
            </DashboardActions>
          </SimpleDashboard>
        )}
        {pageType === 'daily' && (
          <DashboardDateSelect
            title={title}
            date={date}
            onDateChange={date => this.handleDateChange({ date, venueId })}
          >
            <DashboardActions>
              <a
                href={url}
                className="boss-button boss-button_role_calendar boss-page-dashboard__button"
              >
                View by date
              </a>
            </DashboardActions>
          </DashboardDateSelect>
        )}
        <StaffMembersList
          clockInOutData={clockInOutData}
          staffMembers={staffMembers}
          pageType={pageType}
          itemRenderer={({ date, periods }) =>
            this._renderStaffMemberItem({ date, periods })
          }
        />
      </div>
    );
  }
}

export default HoursConfirmation;
