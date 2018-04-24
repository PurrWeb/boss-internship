import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityShiftRequestReviewsPage from '../components/security-shift-request-reviews-page';
import {
  getPendingSecurityShiftRequests,
  getCompletedSecurityShiftRequests,
  getVenueById,
} from '../selectors';

import {
  rejectSecurityShiftRequest,
  undoSecurityShiftRequest,
  acceptSecurityShiftRequest,
  editSecurityShiftRequest,
} from '../redux/actions';

const mapStateToProps = state => {
  return {
    pendingSecurityShiftRequests: getPendingSecurityShiftRequests(state),
    completedSecurityShiftRequests: getCompletedSecurityShiftRequests(state),
    getVenueById: getVenueById(state),
    startDate: state.getIn(['pageOptions', 'startDate']),
    endDate: state.getIn(['pageOptions', 'endDate']),
    date: state.getIn(['pageOptions', 'date']),
  };
};

const mapDispatchToProps = {
  rejectSecurityShiftRequest,
  undoSecurityShiftRequest,
  acceptSecurityShiftRequest,
  editSecurityShiftRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  SecurityShiftRequestReviewsPage,
);
