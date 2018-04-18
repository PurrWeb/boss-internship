import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
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

class SecurityShiftRequestsPage extends Component {
  handleDateChage = ({ startDate }) => {
    location.href = appRoutes.securityShiftRequests({
      startDate,
    });
  };

  handleAddNewRequest = (hideModal, values) => {
    return this.props.addSecurityShiftRequest(values).then(response => {
      hideModal();
    });
  };

  handleOpenAddNewRequest = () => {
    openContentModal({
      submit: this.handleAddNewRequest,
      config: { title: 'Add new shift request' },
    })(AddSecurityShiftRequest);
  };

  render() {
    const { startDate, endDate } = this.props;
    const pendingSecurityShiftRequests = oFetch(this.props, 'pendingSecurityShiftRequests');
    const completedSecurityShiftRequests = oFetch(this.props, 'completedSecurityShiftRequests');
    return (
      <div>
        <DashboardWeekSelect
          startDate={startDate}
          endDate={endDate}
          onDateChange={this.handleDateChage}
          title="Security Shift Requests"
        >
          <DashboardActions>
            <button
              onClick={this.handleOpenAddNewRequest}
              type="button"
              className="boss-button boss-button_role_add boss-page-dashboard__button"
            >
              Add New
            </button>
          </DashboardActions>
        </DashboardWeekSelect>
        <ContentWrapper>
          <SecurityShiftRequestCard title="Pending">
            <SecurityShiftRequestList
              securityShiftRequests={pendingSecurityShiftRequests}
              itemRenderer={securityShiftRequest => {
                return <SecurityShiftRequestItem securityShiftRequest={securityShiftRequest} />;
              }}
            />
          </SecurityShiftRequestCard>
          <SecurityShiftRequestCard title="Completed">
            <SecurityShiftRequestList
              isCompleted
              securityShiftRequests={completedSecurityShiftRequests}
              itemRenderer={securityShiftRequest => {
                return <SecurityShiftRequestItem isCompleted securityShiftRequest={securityShiftRequest} />;
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
  completedSecurityShiftRequests: ImmutablePropTypes.list.isRequired,
  pendingSecurityShiftRequests: ImmutablePropTypes.list.isRequired,
  addSecurityShiftRequest: PropTypes.func.isRequired,
};

export default SecurityShiftRequestsPage;
