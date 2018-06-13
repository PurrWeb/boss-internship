import React from 'react';
import { connect } from 'react-redux';
import Page from '../components/page';
import { getStaffTypesWithFinanceReports, getWeekDates, getAllReady } from '../selectors';
import oFetch from 'o-fetch'
import {
  changePayRateFilter,
  markReportCompleted,
  markReportsCompleted,
} from '../redux/actions';

const mapStateToProps = state => {
  const stateJS = state.toJS();
  const page = oFetch(stateJS, 'page')
  return {
    date: oFetch(page, 'date'),
    venueId: oFetch(page, 'venueId'),
    startDate: oFetch(page, 'startDate'),
    endDate: oFetch(page, 'endDate'),
    venueId: oFetch(page, 'venueId'),
    staffTypesWithFinanceReports: getStaffTypesWithFinanceReports(state),
    weekDates: getWeekDates(state),
    allReady: getAllReady(state),
    payRateFilter: oFetch(page, 'payRateFilter')
  };
};

const mapDispatchToProps = {
  changePayRateFilter,
  markReportCompleted,
  markReportsCompleted,
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
