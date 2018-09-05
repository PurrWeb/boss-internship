import React from 'react';
import {Collapse} from 'react-collapse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DashboardWrapper from '~/components/dashboard-wrapper';
import IncidentReportsFilter from './incident-reports-filter';
import BossSelect from '~/components/boss-select';

import {
  showAddNewReport,
  hideAddNewReport,
  handleVenueSelect,
  handleFilter,
  setCurrentCreator,
  setCurrentStartEnd,
} from '../actions';

const mapStateToProps = (state) => {
  return {
    addingNewReport: state.getIn(['page', 'addingNewReport']),
    startDate: state.getIn(['page', 'filterStartDate']),
    endDate: state.getIn(['page', 'filterEndDate']),
    accessibleVenues: state.getIn(['page', 'accessibleVenues']),
    currentVenueId: state.getIn(['page', 'currentVenueId']),
    reportCreators: state.getIn(['page', 'reportCreators']),
    selectedCreatorId: state.getIn(['page', 'filterReportCreatorId']),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      showAddNewReport,
      hideAddNewReport,
      handleVenueSelect,
      handleFilter,
      setCurrentCreator,
      setCurrentStartEnd,
    }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class IncidentReportsIndexDashboard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFilterOpen: false,
    }
  }

  toggleFilter = () => {
    this.setState({
      isFilterOpen: !this.state.isFilterOpen,
    });
  }

  renderAddNewReportButton() {
    return (
      <button
        onClick={() => this.props.actions.showAddNewReport()}
        className="boss-button boss-button_role_add boss-page-dashboard__button"
      >Add New</button>
    )
  }

  renderAddNewReportDashboardContent() {
    return (
      <div className="boss-page-dashboard__group">
        <div className="boss-page-dashboard__controls-group">
          <div className="boss-form">
            <div className="boss-form__field">
            </div>
          </div>
        </div>
        <div className="boss-page-dashboard__buttons-group">
          <button
            onClick={() => this.props.actions.hideAddNewReport()}
            className="boss-button boss-button_role_cancel boss-page-dashboard__button"
          >Cancel</button>
        </div>
      </div>
    )
  }

  handleSelectVenue = (venue) => {
    this.props.actions.handleVenueSelect({venueId: venue.value});
  }

  handleUpdate = (filterParams) => {
    return this.props.actions.handleFilter(filterParams)
  }

  renderFilter() {
    const reportCreators = this.props.reportCreators;
    const selectedCreatorId = this.props.selectedCreatorId;

    return (
      <div className="boss-page-dashboard__filter">
        <div className="boss-dropdown">
          <div className="boss-dropdown__header">
            <div className="boss-dropdown__header-group">
              <div className="boss-form">
                <div className="boss-form__field boss-form__field_position_last">
                </div>
              </div>
            </div>
            <button
              onClick={this.toggleFilter}
              className="boss-dropdown__switch boss-dropdown__switch_role_filter"
            >Filter</button>
          </div>
          { this.state.isFilterOpen && <IncidentReportsFilter
            handleUpdateClick={this.handleUpdate}
            onCreatorChange={(creatorId) => this.props.actions.setCurrentCreator(creatorId)}
            onStartEndChange={(dates) => this.props.actions.setCurrentStartEnd(dates)}
            selectedCreatorId={selectedCreatorId}
            reportCreators={reportCreators}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
          /> }
        </div>
      </div>      
    )
  }

  render() {
    const {
      isFilterOpen,
    } = this.state;

    const {
      title,
      startDate,
      endDate,
      addingNewReport,
      accessibleVenues,
    } = this.props;

    return (
      <DashboardWrapper>
        <div className="boss-page-dashboard boss-page-dashboard_updated">
          <div className="boss-page-dashboard__group">
            <h1 className="boss-page-dashboard__title">{title}</h1>
            <div className="boss-page-dashboard__buttons-group">
              { !addingNewReport && this.renderAddNewReportButton()}
            </div>
          </div>
          { addingNewReport
              ? this.renderAddNewReportDashboardContent()
              : this.renderFilter()
          }
        </div>
      </DashboardWrapper>
    )
  }
}

export default IncidentReportsIndexDashboard;
