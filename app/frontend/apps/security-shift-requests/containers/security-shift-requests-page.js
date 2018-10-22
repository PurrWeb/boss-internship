import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SecurityShiftRequestsPage from '../components/security-shift-requests-page';
import {
  getPendingSecurityShiftRequests,
  getCompletedSecurityShiftRequests,
  getWeekDaysWithCount,
  venueFilterSelector,
  venuesSelector,
} from '../selectors';
import {
  addSecurityShiftRequest,
  editSecurityShiftRequest,
  deleteSecurityShiftRequest,
  changeWeekDay,
  changeVenueFilter,
} from '../redux/actions';

const mapStateToProps = state => {
  return {
    pendingSecurityShiftRequests: getPendingSecurityShiftRequests(state),
    completedSecurityShiftRequests: getCompletedSecurityShiftRequests(state),
    startDate: state.getIn(['pageOptions', 'startDate']),
    endDate: state.getIn(['pageOptions', 'endDate']),
    date: state.getIn(['pageOptions', 'date']),
    chosenDate: state.getIn(['pageOptions', 'chosenDate']),
    canCreate: state.getIn(['pageOptions', 'canCreate']),
    accessibleVenues: venuesSelector(state),
    weekDates: getWeekDaysWithCount(state),
    venueFilter: venueFilterSelector(state),
  };
};

const mapDispatchToProps = {
  addSecurityShiftRequest,
  editSecurityShiftRequest,
  deleteSecurityShiftRequest,
  changeWeekDay,
  changeVenueFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(SecurityShiftRequestsPage);
