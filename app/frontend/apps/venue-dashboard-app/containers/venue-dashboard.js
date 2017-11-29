import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setInitialData } from '../actions/initial-load'
import MainDashboard from '../components/main-dashboard'
import MainContent from '../components/main-content'

function mapStateToProps(state) {
  return {
    frontend: state.venueDashboard.get('frontend'),
    currentUser: state.venueDashboard.get('currentUser'),
    currentVenue: state.venueDashboard.get('currentVenue'),
    venues: state.venueDashboard.get('venues'),
    messages: state.venueDashboard.get('messages'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setInitialData
  }, dispatch);
}

export class VenueDashboardContainer extends React.Component {
  componentWillMount() {
    this.props.setInitialData(window.boss.venueDashboard);
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

export default connect(mapStateToProps, mapDispatchToProps)(VenueDashboardContainer);
