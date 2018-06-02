import React from 'react';
import oFetch from 'o-fetch';
import { connect } from 'react-redux';
import Page from '../page';
import {
  assigningShiftRequestSelector,
  getStaffMembersWithIsConflicting,
  getRotaShiftsForChosenDay,
  getVenueTypesForChosenDate,
  getShiftRequestsForChosenDate,
  getWeekDaysWithCount,
  getVenueTypesForWeek,
} from '../selectors';

import {
  assignShiftRequest,
  setAssigningShiftRequest,
  changeWeekDay,
  selectVenue,
  rejectSecurityShiftRequest,
  closeGraphDetails,
  showGraphDetails,
} from '../redux/actions';

const mapStateToProps = state => {
  const startDate = oFetch(state.get('page'), 'startDate');
  const endDate = oFetch(state.get('page'), 'endDate');
  const chosenDate = oFetch(state.get('page'), 'chosenDate');
  const selectedVenues = oFetch(state.get('page'), 'selectedVenues');
  return {
    assigningShiftRequest: assigningShiftRequestSelector(state),
    staffMembers: getStaffMembersWithIsConflicting(state),
    rotaShifts: getRotaShiftsForChosenDay(state),
    venueTypes: getVenueTypesForChosenDate(state),
    venueTypesForWeek: getVenueTypesForWeek(state),
    startDate,
    endDate,
    chosenDate,
    selectedVenues,
    shiftRequests: getShiftRequestsForChosenDate(state),
    weekDates: getWeekDaysWithCount(state),
    venues: state.get('venues'),
    isGraphDetailsOpen: state.getIn(['graphDetails', 'isOpen']),
    graphDetails: state.getIn(['graphDetails', 'graphDetails']),
    staffTypes: state.get('staffTypes'),
  };
};

const mapDispatchToProps = {
  assignShiftRequest,
  setAssigningShiftRequest,
  changeWeekDay,
  selectVenue,
  rejectSecurityShiftRequest,
  closeGraphDetails,
  showGraphDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
