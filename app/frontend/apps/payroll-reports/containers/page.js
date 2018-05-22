import React from 'react';
import { connect } from 'react-redux';
import Page from '../components/page';
import { getStaffTypesWithFinanceReports, getWeekDates } from '../selectors';
import {
  changePayRateFilter,
} from '../redux/actions';

const mapStateToProps = state => {
  return {
    date: state.getIn(['page', 'date']),
    venueId: state.getIn(['page', 'venueId']),
    startDate: state.getIn(['page', 'startDate']),
    endDate: state.getIn(['page', 'endDate']),
    venueId: state.getIn(['page', 'venueId']),
    staffTypesWithFinanceReports: getStaffTypesWithFinanceReports(state),
    weekDates: getWeekDates(state),
    payRateFilter: state.getIn(['page', 'payRateFilter']),
  };
};

const mapDispatchToProps = {
  changePayRateFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
