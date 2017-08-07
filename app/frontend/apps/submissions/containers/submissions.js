import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Dashboard from '../components/dashboard';
import MainContent from '../components/main-content';
import SubmissionsFilter from '../components/submissions-filter';
import SubmissionsList from '../components/submissions-list';
import SubmissionsListMobile from '../components/submissions-list.mobile';
import BossModal from '~/components/boss-modal';
import ModalDetailsContent from '../components/modal-details-content';
import Pagination from '../components/pagination';
import {openDetailsModal, closeDetailsModal} from '../actions/details-modal-actions.js';
import { changeVenue } from '../actions/venue-actions';
import {
  toggleFilter,
  setFilterDateRange,
  search,
  setFilterCreatetBy,
  setFilterSubmissionStatus
} from '../actions/filter-actions';
import {changePage} from '../actions/pagination-actions';
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

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      openDetailsModal,
      closeDetailsModal,
      changePage,
      toggleFilter,
      changeVenue,
      setFilterCreatetBy,
      setFilterSubmissionStatus,
      setFilterDateRange,
      search,
    }, dispatch)
  };
}

@connect(createStructuredSelector({
  isDetailsOpen: makeSelectIsDetailsOpen(),
  isFilterOpen: makeSelectIsFilterOpen(),
  detailedSubmission: makeSelectDetailedSubmission(),
  submissions: makeSelectSubmissions(),
  pageCount: makeSelectPageCount(),
  venues: makeSelectVenues(),
  currentVenue: makeSelectCurrentVenue(),
  startDate: makeSelectStartDate(),
  endDate: makeSelectEndDate(),
  submissions: makeSelectSubmissions(),
  currentPage: makeSelectCurrentPage(),
  createdBy: makeSelectCreatedBy(),
  status: makeSelectStatus(),
}), mapDispatchToProps)
class Submissions extends React.Component {  
  search = () => {
    this.props.actions.search(1);
  }
  
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

    return (
      <div>
        <BossModal
          isOpen={isDetailsOpen}
          onCloseClick={closeDetailsModal}
        >
          <ModalDetailsContent submission={detailedSubmission} />
        </BossModal>
        <Dashboard title="Checklist Submissions">
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
        </Dashboard>
        <MainContent inactive={isFilterOpen}>
          <div className="boss-page-main__group boss-page-main__group_adjust_checklist-table">
            <SubmissionsList onDetailsClick={openDetailsModal} items={submissions} />
            <SubmissionsListMobile onDetailsClick={openDetailsModal} items={submissions}/>
          </div>
          {pageCount > 1 && <Pagination pageCount={pageCount} initialPage={currentPage} onPageChange={changePage} />}
        </MainContent>
      </div>
    )
  }
}

export default Submissions
