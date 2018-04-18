import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SecurityShiftRequestsPage from '../components/security-shift-requests-page';
import {
  getPendingSecurityShiftRequests,
  getCompletedSecurityShiftRequests,
} from '../selectors';
import { addSecurityShiftRequest } from '../redux/actions';

const mapStateToProps = state => {
  return {
    pendingSecurityShiftRequests: getPendingSecurityShiftRequests(state),
    completedSecurityShiftRequests: getCompletedSecurityShiftRequests(state),
    startDate: state.getIn(['pageOptions', 'startDate']),
    endDate: state.getIn(['pageOptions', 'endDate']),
  };
};

const mapDispatchToProps = {
  addSecurityShiftRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  SecurityShiftRequestsPage,
);
