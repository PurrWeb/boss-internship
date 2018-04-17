import React from 'react';
import oFetch from 'o-fetch';
import { connect } from 'react-redux';
import SecurityRotaShiftRequestsPage from '../components/security-rota-shift-requests-page';
import {
  getWeekDaysWithCount,
  getShiftRequestsForChosenDate,
  getVenueTypes,
} from '../selectors';
import { changeWeekDay, selectVenue, rejectSecurityShiftRequest } from '../redux/actions';

const mapStateToProps = state => {

  const startDate = oFetch(state.get('page'), 'startDate');
  const endDate = oFetch(state.get('page'), 'endDate');
  const date = oFetch(state.get('page'), 'date');
  const selectedVenues = oFetch(state.get('page'), 'selectedVenues');
  return {
    startDate,
    endDate,
    date,
    selectedVenues,
    shiftRequests: getShiftRequestsForChosenDate(state),
    weekDates: getWeekDaysWithCount(state),
    venues: state.get('venues'),
    venueTypes: getVenueTypes(state),
  };
};

const mapDispatchToProps = {
  changeWeekDay,
  selectVenue,
  rejectSecurityShiftRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  SecurityRotaShiftRequestsPage,
);
