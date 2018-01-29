import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setInitialData } from '../actions/initial-load'
import { setFilterParams, queryFilteredMarketingTasks, queryPaginatedMarketingTasks } from '../actions/filter'
import { setFrontendState, setSelectedMarketingTask } from '../actions/states'
import {
  createGeneralTaskRequest,
  addNote,
  deleteMarketingTask,
  restoreMarketingTask,
  changeStatus,
  queryMarketingTasks
} from '../actions/api-calls'

import MainDashboard from '../components/main-dashboard'
import MainContent from '../components/main-content'

function mapStateToProps(state) {
  return {
    frontend: state.marketing.get('frontend'),
    filter: state.marketing.get('filter'),
    pagination: state.marketing.get('pagination'),
    currentUser: state.marketing.get('currentUser'),
    venues: state.marketing.get('venues'),
    statuses: state.marketing.get('statuses'),
    marketingTasks: state.marketing.get('marketingTasks'),
    generalTasks: state.marketing.get('generalTasks'),
    artworkTasks: state.marketing.get('artworkTasks'),
    musicTasks: state.marketing.get('musicTasks'),
    sportsTasks: state.marketing.get('sportsTasks'),
    selectedMarketingTask: state.marketing.get('selectedMarketingTask'),
    marketingTaskUsers: state.marketing.get('marketingTaskUsers'),
    forms: state.forms
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setInitialData,
    setFrontendState,
    setSelectedMarketingTask,
    addNote,
    createGeneralTaskRequest,
    deleteMarketingTask,
    restoreMarketingTask,
    changeStatus,
    setFilterParams,
    queryMarketingTasks,
    queryFilteredMarketingTasks,
    queryPaginatedMarketingTasks
  }, dispatch);
}

export class MarketingTasksContainer extends React.Component {
  defaultClassNameOfMain = '';
  mainTag = null;

  componentDidMount() {
    this.mainTag = document.querySelector('main');

    if (this.mainTag) {
      this.defaultClassNameOfMain = this.mainTag.className;
      this.mainTag.className = 'boss-root';
    }
  }

  componentWillUnmount() {
    if (this.mainTag) {
      this.mainTag.className = this.defaultClassNameOfMain;
    }
  }

  componentWillMount() {
    this.props.setInitialData(window.boss.marketing);
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

export default connect(mapStateToProps, mapDispatchToProps)(MarketingTasksContainer);
