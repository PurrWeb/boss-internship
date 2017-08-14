import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Dashboard from '../components/dashboard';
import MainContent from '../components/main-content';
import SubmissionsList from '../components/submissions-list';
import SubmissionsListMobile from '../components/submissions-list.mobile';
import BossDetailsModal from '~/components/boss-details-modal';
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

    let currentVenueId = currentVenue.toJS().id;
    return (
      <div>
        <BossDetailsModal
          isOpen={isDetailsOpen}
          onCloseClick={closeDetailsModal}
        >
          <ModalDetailsContent submission={detailedSubmission} />
        </BossDetailsModal>
        <Dashboard {...this.props} title="Checklist Submissions"/>
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
