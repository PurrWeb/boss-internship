import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { appRoutes } from '~/lib/routes';
import ImmutablePropTypes from 'react-immutable-proptypes';
import oFetch from 'o-fetch';
import DashboardWeekSelect from '~/components/boss-dashboards/dashboard-week-select-inline';
import RequestsContent from './requests-content';
import RequestsFilter from './requests-filter';
import RequestItem from './requests-item';

class RequestsPage extends PureComponent {
  handleDateChage = selection => {
    this.goToSecurityRotaShiftRequestsPage({
      startDate: selection.startUIDate,
    });
  };

  goToSecurityRotaShiftRequestsPage({ startDate }) {
    location.href = appRoutes.securityRotaShiftRequests({
      startDate,
    });
  }

  handleOpenAssignPage = (shiftRequest) => {
    const setAssigningShiftRequest = oFetch(
      this.props,
      'setAssigningShiftRequest',
    );
    setAssigningShiftRequest(shiftRequest);
  };

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
    const chosenDate = oFetch(this.props, 'chosenDate');
    return (
      <div className="boss-page-main">
        <DashboardWeekSelect
          startDate={startDate}
          endDate={endDate}
          onDateChange={this.handleDateChage}
          title="Security Rota"
        />
        <RequestsContent
          shiftRequests={shiftRequests}
          itemRenderer={shiftRequest => {
            return (
              <RequestItem
                onOpenAssignPage={this.handleOpenAssignPage}
                shiftRequest={shiftRequest}
                rejectSecurityShiftRequest={rejectSecurityShiftRequest}
              />
            );
          }}
        >
          <RequestsFilter
            date={chosenDate}
            weekDates={weekDates}
            changeWeekDay={changeWeekDay}
            selectVenue={selectVenue}
            selectedVenues={selectedVenues}
            venueTypes={venueTypes}
          />
        </RequestsContent>
      </div>
    );
  }
}

RequestsPage.propTypes = {
  startDate: PropTypes.string.isRequired,
  chosenDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  weekDates: ImmutablePropTypes.list.isRequired,
  shiftRequests: ImmutablePropTypes.list.isRequired,
  changeWeekDay: PropTypes.func.isRequired,
  selectVenue: PropTypes.func.isRequired,
  rejectSecurityShiftRequest: PropTypes.func.isRequired,
  selectedVenues: PropTypes.array.isRequired,
  venueTypes: ImmutablePropTypes.list.isRequired,
  setAssigningShiftRequest: PropTypes.func.isRequired,
};

export default RequestsPage;
