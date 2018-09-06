import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { DashboardActions } from '~/components/boss-dashboards';
import { appRoutes } from '~/lib/routes';
import ContentWrapper from '~/components/content-wrapper';
import DashboardWeekSelect from '~/components/boss-dashboards/dashboard-week-select';
import SecurityShiftRequestCard from '~/components/security-shift-requests/security-shift-request-card';
import SecurityShiftRequestVenueList from './security-shift-request-venue-list';
import SecurityShiftRequestVenueCard from './security-shift-request-venue-card';
import SecurityShiftRequestItem from './security-shift-request-item';
import WeekFilter from './requests-week-filter';

class SecurityShiftRequestReviewsPage extends Component {
  handleDateChage = ({ startUIDate }) => {
    location.href = appRoutes.securityShiftRequestReviews({
      startDate: startUIDate,
    });
  };

  render() {
    const startDate = oFetch(this.props, 'startDate');
    const endDate = oFetch(this.props, 'endDate');
    const editSecurityShiftRequest = oFetch(this.props, 'editSecurityShiftRequest');
    const rejectSecurityShiftRequest = oFetch(this.props, 'rejectSecurityShiftRequest');
    const undoSecurityShiftRequest = oFetch(this.props, 'undoSecurityShiftRequest');
    const acceptSecurityShiftRequest = oFetch(this.props, 'acceptSecurityShiftRequest');
    const pendingSecurityShiftRequests = oFetch(this.props, 'pendingSecurityShiftRequests');
    const completedSecurityShiftRequests = oFetch(this.props, 'completedSecurityShiftRequests');
    const date = oFetch(this.props, 'date');
    const changeWeekDay = oFetch(this.props, 'changeWeekDay');
    const weekDates = oFetch(this.props, 'weekDates');
    return (
      <div>
        <DashboardWeekSelect
          startDate={startDate}
          endDate={endDate}
          onDateChange={this.handleDateChage}
          title="Security Shift Request Reviews"
        />
        <ContentWrapper>
          <WeekFilter date={date} onChange={changeWeekDay} weekDates={weekDates.toJS()} />
          <SecurityShiftRequestCard title="Pending">
            <SecurityShiftRequestVenueList
              securityShiftRequestsGrupedByVenueId={pendingSecurityShiftRequests}
              venueCardRenderer={(securityShiftRequests, venueId) => {
                return (
                  <SecurityShiftRequestVenueCard
                    isCompleted={false}
                    securityShiftRequests={securityShiftRequests}
                    venue={this.props.getVenueById(venueId)}
                    itemRenderer={securityShiftRequest => {
                      return (
                        <SecurityShiftRequestItem
                          securityShiftRequest={securityShiftRequest}
                          editSecurityShiftRequest={editSecurityShiftRequest}
                          rejectSecurityShiftRequest={rejectSecurityShiftRequest}
                          acceptSecurityShiftRequest={acceptSecurityShiftRequest}
                        />
                      );
                    }}
                  />
                );
              }}
            />
          </SecurityShiftRequestCard>
          <SecurityShiftRequestCard title="Completed">
            <SecurityShiftRequestVenueList
              securityShiftRequestsGrupedByVenueId={completedSecurityShiftRequests}
              venueCardRenderer={(securityShiftRequests, venueId) => {
                return (
                  <SecurityShiftRequestVenueCard
                    isCompleted
                    securityShiftRequests={securityShiftRequests}
                    venue={this.props.getVenueById(venueId)}
                    itemRenderer={securityShiftRequest => {
                      return (
                        <SecurityShiftRequestItem
                          isCompleted
                          securityShiftRequest={securityShiftRequest}
                          undoSecurityShiftRequest={undoSecurityShiftRequest}
                        />
                      );
                    }}
                  />
                );
              }}
            />
          </SecurityShiftRequestCard>
        </ContentWrapper>
      </div>
    );
  }
}

SecurityShiftRequestReviewsPage.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  completedSecurityShiftRequests: ImmutablePropTypes.map.isRequired,
  pendingSecurityShiftRequests: ImmutablePropTypes.map.isRequired,
  editSecurityShiftRequest: PropTypes.func.isRequired,
  rejectSecurityShiftRequest: PropTypes.func.isRequired,
  undoSecurityShiftRequest: PropTypes.func.isRequired,
  acceptSecurityShiftRequest: PropTypes.func.isRequired,
  changeWeekDay: PropTypes.func.isRequired,
  weekDates: ImmutablePropTypes.list.isRequired,
};

export default SecurityShiftRequestReviewsPage;
