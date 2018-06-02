import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import oFetch from 'o-fetch';
import RequestsPage from './components/requests-page/requests-page';
import AssignPage from './components/assign-page/assign-page';

class Page extends PureComponent {
  render() {
    const shiftRequest = oFetch(this.props, 'assigningShiftRequest');
    const venueTypes = oFetch(this.props, 'venueTypes');
    const rotaShifts = oFetch(this.props, 'rotaShifts');
    const staffMembers = oFetch(this.props, 'staffMembers');
    const assignShiftRequest = oFetch(this.props, 'assignShiftRequest');

    const startDate = oFetch(this.props, 'startDate');
    const endDate = oFetch(this.props, 'endDate');
    const chosenDate = oFetch(this.props, 'chosenDate');
    const weekDates = oFetch(this.props, 'weekDates');
    const shiftRequests = oFetch(this.props, 'shiftRequests');
    const changeWeekDay = oFetch(this.props, 'changeWeekDay');
    const selectVenue = oFetch(this.props, 'selectVenue');
    const closeGraphDetails = oFetch(this.props, 'closeGraphDetails');
    const showGraphDetails = oFetch(this.props, 'showGraphDetails');

    const rejectSecurityShiftRequest = oFetch(
      this.props,
      'rejectSecurityShiftRequest',
    );
    const selectedVenues = oFetch(this.props, 'selectedVenues');
    const setAssigningShiftRequest = oFetch(
      this.props,
      'setAssigningShiftRequest',
    );
    const venueTypesForWeek = oFetch(this.props, 'venueTypesForWeek');
    const isGraphDetailsOpen = oFetch(this.props, 'isGraphDetailsOpen');
    const graphDetails = oFetch(this.props, 'graphDetails');
    const staffTypes = oFetch(this.props, 'staffTypes');
    return (
      <div>
        {shiftRequest ? (
          <AssignPage
            staffMembers={staffMembers}
            rotaShifts={rotaShifts}
            venueTypes={venueTypes}
            shiftRequest={shiftRequest}
            assignShiftRequest={assignShiftRequest}
            setAssigningShiftRequest={setAssigningShiftRequest}
            showGraphDetails={showGraphDetails}
            closeGraphDetails={closeGraphDetails}
            isGraphDetailsOpen={isGraphDetailsOpen}
            graphDetails={graphDetails}
            staffTypes={staffTypes}
          />
        ) : (
          <RequestsPage
            startDate={startDate}
            endDate={endDate}
            chosenDate={chosenDate}
            weekDates={weekDates}
            shiftRequests={shiftRequests}
            changeWeekDay={changeWeekDay}
            selectVenue={selectVenue}
            rejectSecurityShiftRequest={rejectSecurityShiftRequest}
            selectedVenues={selectedVenues}
            venueTypes={venueTypesForWeek}
            setAssigningShiftRequest={setAssigningShiftRequest}
          />
        )}
      </div>
    );
  }
}

Page.propTypes = {
  assigningShiftRequest: PropTypes.object,
  staffMembers: ImmutablePropTypes.list.isRequired,
  rotaShifts: ImmutablePropTypes.list.isRequired,
  assignShiftRequest: PropTypes.func.isRequired,
  venueTypesForWeek: ImmutablePropTypes.list.isRequired,
  startDate: PropTypes.string.isRequired,
  chosenDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  weekDates: ImmutablePropTypes.list.isRequired,
  shiftRequests: ImmutablePropTypes.list.isRequired,
  changeWeekDay: PropTypes.func.isRequired,
  selectVenue: PropTypes.func.isRequired,
  rejectSecurityShiftRequest: PropTypes.func.isRequired,
  selectedVenues: PropTypes.array.isRequired,
  venueTypes: ImmutablePropTypes.list.isRequired,
  staffTypes: ImmutablePropTypes.list.isRequired,
  setAssigningShiftRequest: PropTypes.func.isRequired,
  closeGraphDetails: PropTypes.func.isRequired,
  showGraphDetails: PropTypes.func.isRequired,
  isGraphDetailsOpen: PropTypes.bool.isRequired,
  graphDetails: ImmutablePropTypes.map,
};

export default Page;
