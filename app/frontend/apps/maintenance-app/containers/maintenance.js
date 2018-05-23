import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setInitialData } from '../actions/initial-load'
import { queryMaintenanceTasks, changeStatus, addNote, createTask, deleteMaintenanceTask, editMaintenanceTask, deleteMaintenanceTaskImage } from '../actions/api-calls'
import { setFilterParams } from '../actions/filter'
import { setFrontendState, setCurrentMaintenanceTask, setMaintenanceTaskImageUpload } from '../actions/states'
import MainDashboard from '../components/main-dashboard'
import MainContent from '../components/main-content'

function mapStateToProps(state) {
  return {
    frontend: state.maintenance.get('frontend'),
    filter: state.maintenance.get('filter'),
    currentUser: state.maintenance.get('currentUser'),
    venues: state.maintenance.get('venues'),
    priorities: state.maintenance.get('priorities'),
    statuses: state.maintenance.get('statuses'),
    maintenanceTasks: state.maintenance.get('maintenanceTasks'),
    selectedMaintenanceTask: state.maintenance.get('selectedMaintenanceTask'),
    forms: state.forms,
    maintenanceTaskImageUploads: state.maintenance.get('maintenanceTaskImageUploads'),
    tempMaintenanceTasks: state.maintenance.get('tempMaintenanceTasks'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setInitialData,
    queryMaintenanceTasks,
    setFilterParams,
    setFrontendState,
    setCurrentMaintenanceTask,
    changeStatus,
    addNote,
    createTask,
    deleteMaintenanceTask,
    editMaintenanceTask,
    setMaintenanceTaskImageUpload,
    deleteMaintenanceTaskImage,
  }, dispatch);
}

export class MaintenanceContainer extends React.Component {
  componentWillMount() {
    // this.props.setInitialData(window.boss.maintenance);
  }

  closeErrorBox() {
    this.props.setFrontendState({ showErrorBox: false, errorMessage: '' });
  }

  closeSuccessBox() {
    this.props.setFrontendState({ showSuccessBox: false, successMessage: '' });
  }

  renderSuccessBox() {
    if (!this.props.frontend.showSuccessBox) {
      return;
    }

    return (
      <div className="boss-alert boss-alert_role_page-note boss-alert_status_success boss-alert_position_fixed">
        <p className="boss-alert__text">{ this.props.frontend.successMessage }</p>
        <a className="boss-alert__button-close" onClick={ this.closeSuccessBox.bind(this) }></a>
      </div>
    );
  }

  renderErrorBox() {
    if (!this.props.frontend.showErrorBox) {
      return;
    }

    return (
      <div className="boss-alert boss-alert_role_page-note boss-alert_role_danger boss-alert_status_danger boss-alert_position_fixed">
        <p className="boss-alert__text">{ this.props.frontend.errorMessage }</p>
        <a className="boss-alert__button-close" onClick={ this.closeErrorBox.bind(this) }></a>
      </div>
    );
  }

  render() {
    return (
      <main className="boss-page-main">
        { this.renderErrorBox() }
        { this.renderSuccessBox() }

        <MainDashboard { ...this.props } />
        <MainContent { ...this.props } />
      </main>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MaintenanceContainer);
