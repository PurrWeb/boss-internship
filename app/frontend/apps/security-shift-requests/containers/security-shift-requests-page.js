import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SecurityShiftRequestsPage from '../components/security-shift-requests-page';
import { getPendingSecurityShiftRequests, getCompletedSecurityShiftRequests, getWeekDaysWithCount, venueIdSelector } from '../selectors';
import { addSecurityShiftRequest, editSecurityShiftRequest, deleteSecurityShiftRequest, changeWeekDay } from '../redux/actions';

const mapStateToProps = state => {
  return {
    pendingSecurityShiftRequests: getPendingSecurityShiftRequests(state),
    completedSecurityShiftRequests: getCompletedSecurityShiftRequests(state),
    startDate: state.getIn(['pageOptions', 'startDate']),
    endDate: state.getIn(['pageOptions', 'endDate']),
    date: state.getIn(['pageOptions', 'date']),
    canCreate: state.getIn(['pageOptions', 'canCreate']),
    weekDates: getWeekDaysWithCount(state),
    venueId: venueIdSelector(state,)
  };
};

const mapDispatchToProps = {
  addSecurityShiftRequest,
  editSecurityShiftRequest,
  deleteSecurityShiftRequest,
  changeWeekDay,
};

export default connect(mapStateToProps, mapDispatchToProps)(SecurityShiftRequestsPage);
