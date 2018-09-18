import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import SimpleDashboard from './simple-dashboard';
import { DashboardActions } from '~/components/boss-dashboards';

class StaffDashboard extends Component {
  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <SimpleDashboard filterRenderer={this.props.filterRenderer} title={this.props.title}>
        <DashboardActions>
          <button
            type="button"
            className="boss-button boss-button_role_primary boss-page-dashboard__button"
            onClick={this.goBack}
          >
            Return to Staff Vetting Index
          </button>
        </DashboardActions>
      </SimpleDashboard>
    );
  }
}

StaffDashboard.propTypes = {
  title: PropTypes.func.isRequired,
};

export default withRouter(StaffDashboard);
