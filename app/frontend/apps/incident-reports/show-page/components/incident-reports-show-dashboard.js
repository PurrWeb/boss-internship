import React from 'react';
import {Collapse} from 'react-collapse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import DashboardWrapper from '~/components/dashboard-wrapper';
import confirm from '~/lib/confirm-utils';

import {
  showEditReport,
  hideEditReport,
  disableIncidentReport,
} from '../actions';

const mapStateToProps = (state) => {
  return {
    editingReport: state.getIn(['page', 'editingReport']),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      showEditReport,
      hideEditReport,
      disableIncidentReport,
    }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class IncidentReportsShowDashboard extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  handleDisableReport = () => {
    confirm('Are you sure?', {
      title: 'WARNING !!!',
      actionButtonText: 'Disable'
    }).then(resp => {
      this.props.actions.disableIncidentReport(this.props.incidentReport.id);
    });
  }

  renderReportButtons() {
    return (
      <div className="boss-page-dashboard__buttons-group">
        <a href="/incident_reports" className="boss-button boss-page-dashboard__button">Back to Index</a>
        <button
          onClick={() => this.props.actions.showEditReport()}
          className="boss-button boss-button_role_edit-mode boss-page-dashboard__button"
        >Edit</button>
        <button
          onClick={this.handleDisableReport}
          className="boss-button boss-button_role_cancel boss-page-dashboard__button"
        >Disable</button>
    </div>
    )
  }

  renderCancelEditReportButton() {
    return (
      <button
        onClick={() => this.props.actions.hideEditReport()}
        className="boss-button boss-button_role_cancel boss-page-dashboard__button"
      >Cancel</button>
    )
  }

  render() {
    const {
      title,
      editingReport,
      incidentReport,
    } = this.props;

    const createdAtFormatted = moment(incidentReport.createdAt).format('Mo MMMM YYYY');

    return (
      <DashboardWrapper>
        <div className="boss-page-dashboard boss-page-dashboard_updated boss-page-dashboard_page_incident-report-full">
          <div className="boss-page-dashboard__group">
            <h1 className="boss-page-dashboard__title">
              <span className="boss-page-dashboard__title-text">Incident Report for&nbsp;</span>
              <span className="boss-page-dashboard__title-text boss-page-dashboard__title-text_marked">{incidentReport.description}</span>
            </h1>
          </div>
          <div className="boss-page-dashboard__group">
            <div className="boss-page-dashboard__meta">
              <p className="boss-page-dashboard__meta-item boss-page-dashboard__meta-item_role_user">
                <span className="boss-page-dashboard__meta-text">Created By</span>
                <a href="#" className="boss-page-dashboard__meta-link boss-page-dashboard__meta-link_role_name">
                  {incidentReport.creator.name}
                </a>
              </p>
              <p className="boss-page-dashboard__meta-item boss-page-dashboard__meta-item_role_date">
                <span className="boss-page-dashboard__meta-text">{createdAtFormatted}</span>
              </p>
            </div>
            <div className="boss-page-dashboard__buttons-group">
              { editingReport
                  ? this.renderCancelEditReportButton()
                  : this.renderReportButtons()
              }
            </div>
          </div>
        </div>
      </DashboardWrapper>
    )
  }
}

export default IncidentReportsShowDashboard;
