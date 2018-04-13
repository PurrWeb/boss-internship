import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HolidayRequestsPage from '../components/holiday-requests-page';

import { acceptHolidayRequest, rejectHolidayRequest } from '../redux/actions';

const mapStateToProps = state => ({
  staffMembers: state.get('staffMembers'),
  holidayRequests: state.get('holidayRequests'),
});

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ acceptHolidayRequest, rejectHolidayRequest }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HolidayRequestsPage);
