import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import urlSearchParams from 'url-search-params';
import safeMoment from '~/lib/safe-moment';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { DashboardActions } from '~/components/boss-dashboards';
import ContentWrapper from '~/components/content-wrapper';
import DashboardWeekSelect from '~/components/boss-dashboards/dashboard-week-select';
import { openWarningModal, openContentModal } from '~/components/modals';
import { appRoutes } from '~/lib/routes';
import AddSecurityShiftRequest from './add-security-shift-request';
import SecurityShiftRequestCard from '~/components/security-shift-requests/security-shift-request-card';
import SecurityShiftRequestList from './security-shift-request-list';
import SecurityShiftRequestItem from './security-shift-request-item';
import EditSecurityShiftRequest from './edit-security-shift-request';
import VenueSelect from './venue-select';
import utils from '~/lib/utils';
import WeekFilter from './requests-week-filter';

class SecurityShiftRequestsPage extends Component {
  state = {
    venueFilter: oFetch(this.props.venueFilter) === 'all' ? null : oFetch(this.props.venueFilter),
  };

  handleEditRequest = (hideModal, values) => {
    const editSecurityShiftRequest = oFetch(this.props, 'editSecurityShiftRequest');
    return editSecurityShiftRequest(values).then(response => {
      hideModal();
    });
  };

  handleOpenEditSecurityShiftRequest = securityShiftRequest => {
    const id = oFetch(securityShiftRequest, 'id');
    const startsAt = oFetch(securityShiftRequest, 'startsAt');
    const endsAt = oFetch(securityShiftRequest, 'endsAt');
    const status = oFetch(securityShiftRequest, 'status');
    const venueId = oFetch(securityShiftRequest, 'venueId');
    const note = oFetch(securityShiftRequest, 'note');
    const accessibleVenues = oFetch(this.props, 'accessibleVenues');
    const shiftMinutes = utils.getDiffFromRotaDayInMinutes(
      safeMoment.iso8601Parse(startsAt),
      safeMoment.iso8601Parse(endsAt),
    );
    const editRequestFormInitialValues = {
      startsAt: oFetch(shiftMinutes, 'startMinutes'),
      endsAt: oFetch(shiftMinutes, 'endMinutes'),
      venueId,
      note,
      date: utils.getBuisnessDay(safeMoment.iso8601Parse(startsAt)),
      id,
    };
    openContentModal({
      submit: this.handleEditRequest,
      config: { title: 'Edit Shift Request' },
      props: { editRequestFormInitialValues, accessibleVenues },
    })(EditSecurityShiftRequest);
  };

  handleDateChage = ({ startUIDate }) => {
    location.href = appRoutes.securityShiftRequests({
      startDate: startUIDate,
    });
  };

  handleDeleteSecurityShiftRequest = id => {
    const deleteSecurityShiftRequestAction = oFetch(this.props, 'deleteSecurityShiftRequest');

    return deleteSecurityShiftRequestAction(id);
  };

  handleAddNewRequest = (hideModal, values) => {
    return this.props.addSecurityShiftRequest(values).then(response => {
      hideModal();
    });
  };

  handleOpenAddNewRequest = () => {
    const date = oFetch(this.props, 'date');
    const accessibleVenues = oFetch(this.props, 'accessibleVenues');
    openContentModal({
      submit: this.handleAddNewRequest,
      config: { title: 'Add new shift request' },
      props: { date: safeMoment.parse(date, 'DD-MM-YYYY'), accessibleVenues },
    })(AddSecurityShiftRequest);
  };

  handleVenueFilterSelect = value => {
    const changeVenueFilter = oFetch(this.props, 'changeVenueFilter');
    const chosenDate = oFetch(this.props, 'chosenDate');
    changeVenueFilter(value);
    window.history.pushState('state', 'title', `/security-shift-requests/${chosenDate}?venue_id=${value || 'all'}`);
  };

  handleChangeURLDate = date => {
    const chosenDate = oFetch(this.props, 'chosenDate');
    window.history.pushState(
      'state',
      'title',
      `/security-shift-requests/${date === 'All' ? chosenDate : date}?venue_id=${this.props.venueFilter || 'all'}`,
    );
    this.props.changeWeekDay({ chosenDate: date });
  };

  render() {
    const startDate = oFetch(this.props, 'startDate');
    const endDate = oFetch(this.props, 'endDate');
    const pendingSecurityShiftRequests = oFetch(this.props, 'pendingSecurityShiftRequests');
    const completedSecurityShiftRequests = oFetch(this.props, 'completedSecurityShiftRequests');
    const canCreate = oFetch(this.props, 'canCreate');
    const date = oFetch(this.props, 'date');
    const chosenDate = oFetch(this.props, 'chosenDate');
    const weekDates = oFetch(this.props, 'weekDates');
    const jsAccessibleVenues = oFetch(this.props, 'accessibleVenues').toJS();
    return (
      <div>
        <DashboardWeekSelect
          startDate={startDate}
          endDate={endDate}
          onDateChange={this.handleDateChage}
          title="Security Shift Requests"
        >
          {canCreate && (
            <DashboardActions>
              <button
                onClick={this.handleOpenAddNewRequest}
                type="button"
                className="boss-button boss-button_role_add boss-page-dashboard__button"
              >
                Add New
              </button>
            </DashboardActions>
          )}
        </DashboardWeekSelect>
        <ContentWrapper>
          <div className="boss-page-main__filter">
            <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min">
              <p className="boss-form__label boss-form__label_type_icon-filter">
                <span className="boss-form__label-text">Venue filter</span>
              </p>
              <VenueSelect
                selected={this.props.venueFilter}
                onChange={this.handleVenueFilterSelect}
                clearable
                venues={jsAccessibleVenues}
              />
            </div>
          </div>
          <WeekFilter date={chosenDate} onChange={this.handleChangeURLDate} weekDates={weekDates.toJS()} />
          <SecurityShiftRequestCard title="Pending">
            <SecurityShiftRequestList
              securityShiftRequests={pendingSecurityShiftRequests}
              itemRenderer={securityShiftRequest => {
                return (
                  <SecurityShiftRequestItem
                    onOpenEditSecurityShiftRequest={() => this.handleOpenEditSecurityShiftRequest(securityShiftRequest)}
                    onDeleteSecurityShiftRequest={() =>
                      this.handleDeleteSecurityShiftRequest(oFetch(securityShiftRequest, 'id'))
                    }
                    securityShiftRequest={securityShiftRequest}
                    venue={jsAccessibleVenues.find(
                      venue => oFetch(venue, 'id') === oFetch(securityShiftRequest, 'venueId'),
                    )}
                  />
                );
              }}
            />
          </SecurityShiftRequestCard>
          <SecurityShiftRequestCard title="Completed">
            <SecurityShiftRequestList
              isCompleted
              securityShiftRequests={completedSecurityShiftRequests}
              itemRenderer={securityShiftRequest => {
                return (
                  <SecurityShiftRequestItem
                    isCompleted
                    onOpenEditSecurityShiftRequest={() => this.handleOpenEditSecurityShiftRequest(securityShiftRequest)}
                    onDeleteSecurityShiftRequest={() =>
                      this.handleDeleteSecurityShiftRequest(oFetch(securityShiftRequest, 'id'))
                    }
                    securityShiftRequest={securityShiftRequest}
                    venue={jsAccessibleVenues.find(
                      venue => oFetch(venue, 'id') === oFetch(securityShiftRequest, 'venueId'),
                    )}
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

SecurityShiftRequestsPage.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  completedSecurityShiftRequests: ImmutablePropTypes.list.isRequired,
  pendingSecurityShiftRequests: ImmutablePropTypes.list.isRequired,
  addSecurityShiftRequest: PropTypes.func.isRequired,
  changeWeekDay: PropTypes.func.isRequired,
  weekDates: ImmutablePropTypes.list.isRequired,
  venueFilter: PropTypes.string.isRequired,
};

export default SecurityShiftRequestsPage;
