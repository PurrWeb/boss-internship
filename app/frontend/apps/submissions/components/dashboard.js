import React from 'react';
import PropTypes from 'prop-types';
import SubmissionsFilter from '../components/submissions-filter';
import { appRoutes } from "~/lib/routes"
import {
  toggleFilter,
  setFilterDateRange,
  search,
  setFilterCreatetBy,
  setFilterSubmissionStatus
} from '../actions/filter-actions';
import { changeVenue } from '../actions/venue-actions';
import {
  makeSelectIsDetailsOpen,
  makeSelectIsFilterOpen,
  makeSelectDetailedSubmission,
  makeSelectSubmissions,
  makeSelectPageCount,
  makeSelectCurrentVenue,
  makeSelectVenues,
  makeSelectStartDate,
  makeSelectEndDate,
  makeSelectCurrentPage,
  makeSelectCreatedBy,
  makeSelectStatus,
} from '../selectors';

class Dashboard extends React.Component {
  render() {
    const {
      isDetailsOpen,
      detailedSubmission,
      submissions,
      pageCount,
      startDate,
      endDate,
      isFilterOpen,
      venues,
      currentVenue,
      currentPage,
      createdBy,
      status,
      title
    } = this.props;

    const {
      toggleFilter,
      changeVenue,
      openDetailsModal,
      closeDetailsModal,
      setFilterCreatetBy,
      setFilterSubmissionStatus,
      setFilterDateRange,
      search,
      changePage,
    } = this.props.actions;

    let currentVenueId = currentVenue.toJS().id;

    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              <h1 className="boss-page-dashboard__title">{title}</h1>
              <div className="boss-page-dashboard__buttons-group">
                <a href={appRoutes.checklistsPage({venueId: currentVenueId})} className={"boss-button boss-button_role_add boss-page-dashboard__button"}>Submit New</a>
              </div>
            </div>
            <SubmissionsFilter
              onToggleFilter={toggleFilter}
              onSelectVenue={changeVenue}
              isFilterOpen={isFilterOpen}
              onCretedByChange={setFilterCreatetBy}
              onStatusChange={setFilterSubmissionStatus}
              onDatesChange={setFilterDateRange}
              venues={venues}
              startDate={startDate}
              endDate={endDate}
              currentVenue={currentVenue}
              submissions={submissions}
              createdBy={createdBy}
              status={status}
              onSearch={this.search}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard;
