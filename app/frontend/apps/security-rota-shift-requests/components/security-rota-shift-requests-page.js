import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { appRoutes } from '~/lib/routes';
import ImmutablePropTypes from 'react-immutable-proptypes';
import oFetch from 'o-fetch';
import DashboardWeekSelect from '~/components/boss-dashboards/dashboard-week-select-inline';
import SecurityRotaShiftRequestsContent from './security-rota-shift-requests-content';
import SecurityRotaShiftRequestsFilter from './security-rota-shift-requests-filter';
import SecurityRotaShiftRequestItem from './security-rota-shift-requests-item';

const getDateFromURL = () => window.location.pathname.split('/')[2];

class SecurityRotaShiftRequestsPage extends Component {
  handleDateChage = selection => {
    this.goToSecurityRotaShiftRequestsPage({
      startDate: selection.startDate,
    });
  };

  goToSecurityRotaShiftRequestsPage({ startDate }) {
    location.href = appRoutes.securityRotaShiftRequests({
      startDate,
    });
  }

  render() {
    const startDate = oFetch(this.props, 'startDate');
    const endDate = oFetch(this.props, 'endDate');
    const weekDates = oFetch(this.props, 'weekDates');
    const shiftRequests = oFetch(this.props, 'shiftRequests');
    const changeWeekDay = oFetch(this.props, 'changeWeekDay');
    const selectVenue = oFetch(this.props, 'selectVenue');
    const rejectSecurityShiftRequest = oFetch(
      this.props,
      'rejectSecurityShiftRequest',
    );
    const selectedVenues = oFetch(this.props, 'selectedVenues');
    const venueTypes = oFetch(this.props, 'venueTypes');
    const date = oFetch(this.props, 'date');
    return (
      <div className="boss-page-main">
        <DashboardWeekSelect
          startDate={startDate}
          endDate={endDate}
          onDateChange={this.handleDateChage}
          title="Security Rota"
        />
        <SecurityRotaShiftRequestsContent
          shiftRequests={shiftRequests}
          itemRenderer={shiftRequest => {
            return (
              <SecurityRotaShiftRequestItem
                shiftRequest={shiftRequest}
                rejectSecurityShiftRequest={rejectSecurityShiftRequest}
              />
            );
          }}
        >
          <SecurityRotaShiftRequestsFilter
            date={date}
            weekDates={weekDates}
            changeWeekDay={changeWeekDay}
            selectVenue={selectVenue}
            selectedVenues={selectedVenues}
            venueTypes={venueTypes}
          />
        </SecurityRotaShiftRequestsContent>
      </div>
    );
  }
}

SecurityRotaShiftRequestsPage.propTypes = {
  startDate: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  weekDates: ImmutablePropTypes.list.isRequired,
  shiftRequests: ImmutablePropTypes.list.isRequired,
  changeWeekDay: PropTypes.func.isRequired,
  selectVenue: PropTypes.func.isRequired,
  rejectSecurityShiftRequest: PropTypes.func.isRequired,
  selectedVenues: PropTypes.array.isRequired,
  venueTypes: ImmutablePropTypes.list.isRequired,
};

export default SecurityRotaShiftRequestsPage;
