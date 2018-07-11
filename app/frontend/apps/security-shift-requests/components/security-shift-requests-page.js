import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
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
import utils from '~/lib/utils';
import WeekFilter from './requests-week-filter';

class SecurityShiftRequestsPage extends Component {
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
      props: { editRequestFormInitialValues },
    })(EditSecurityShiftRequest);
  };

  handleDateChage = ({ startDate }) => {
    location.href = appRoutes.securityShiftRequests({
      startDate,
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
    openContentModal({
      submit: this.handleAddNewRequest,
      config: { title: 'Add new shift request' },
      props: { date: safeMoment.parse(date, 'DD-MM-YYYY') },
    })(AddSecurityShiftRequest);
  };

  render() {
    const startDate = oFetch(this.props, 'startDate');
    const endDate = oFetch(this.props, 'endDate');
    const pendingSecurityShiftRequests = oFetch(this.props, 'pendingSecurityShiftRequests');
    const completedSecurityShiftRequests = oFetch(this.props, 'completedSecurityShiftRequests');
    const canCreate = oFetch(this.props, 'canCreate');
    const date = oFetch(this.props, 'date');
    const changeWeekDay = oFetch(this.props, 'changeWeekDay');
    const weekDates = oFetch(this.props, 'weekDates');
    const venueId = oFetch(this.props, 'venueId');
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
          <WeekFilter
              date={date}
              onChange={changeWeekDay}
              weekDates={weekDates.toJS()}
              venueId={venueId}
            />
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
  venueId: PropTypes.number.isRequired,
};

export default SecurityShiftRequestsPage;
