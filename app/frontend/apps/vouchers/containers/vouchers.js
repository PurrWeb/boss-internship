import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Dashborad from '../components/dashboard';
import AllDisabledDateRangeFilter from '~/components/all-disabled-date-range-filter';
import VouchersUI from '../components/vouchers-list';
import Pagination from '~/components/pagination';
import BossDetailsModal from '~/components/boss-details-modal';
import AddVoucherModal from '../components/add-voucher-modal';
import {openVoucherModal, closeVoucherModal, createVoucher, deleteVoucher} from '../actions/add-voucher-modal.js';
import {changePage} from '../actions/pagination-actions';
import { changeVenue } from '../actions/venue-actions.js';
import {changeStatusFilter} from '../actions/filter-actions.js';

import {
  makeSelectVouchers,
  makeSelectPageCount,
  makeSelectCurrentVenue,
  makeSelectVenues,
  makeSelectStartDate,
  makeSelectEndDate,
  makeSelectCurrentPage,
  makeSelectStatus,
  makeSelectIsVoucherModalOpen,
} from '../selectors';

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      openVoucherModal,
      closeVoucherModal,
      createVoucher,
      deleteVoucher,
      changePage,
      changeVenue,
      changeStatusFilter
    }, dispatch)
  };
}

@connect(createStructuredSelector({
  isModalOpen: makeSelectIsVoucherModalOpen(),
  vouchers: makeSelectVouchers(),
  pageCount: makeSelectPageCount(),
  venues: makeSelectVenues(),
  currentVenue: makeSelectCurrentVenue(),
  startDate: makeSelectStartDate(),
  endDate: makeSelectEndDate(),
  currentPage: makeSelectCurrentPage(),
  status: makeSelectStatus(),
}), mapDispatchToProps)
class Vouchers extends React.Component {
  handleChangePage = (value) => {
    let queryParams = new URLSearchParams(window.location.search);
    queryParams.set('page', value);
    const link = `${window.location.href.split('?')[0]}?${queryParams.toString()}`
    window.location.href = link;
  }

  render() {
    const {
      venues,
      vouchers,
      currentVenue,
      isModalOpen,
      pageCount,
      currentPage,
      status,
      startDate,
      endDate,
    } = this.props;

    const {
      openVoucherModal,
      closeVoucherModal,
      createVoucher,
      deleteVoucher,
      changePage,
      changeVenue,
      changeStatusFilter,
    } = this.props.actions;

    let filteringByStatus = status === 'active';

    return (
      <div>
        <BossDetailsModal
          isOpen={isModalOpen}
          className="boss-modal-window boss-modal-window_role_add-new"
          onCloseClick={closeVoucherModal}
        >
          <AddVoucherModal createVoucher={createVoucher} />
        </BossDetailsModal>
        <main className="boss-page-main">
          <Dashborad title="Vouchers" venues={venues} currentVenue={currentVenue} onAddClick={openVoucherModal} changeVenue={changeVenue}/>
          <div className="boss-page-main__content">
            <div className="boss-page-main__inner">
              <AllDisabledDateRangeFilter
                dateTitle="Used"
                selectedStatus={status}
                startDate={startDate}
                endDate={endDate}
              />
              <VouchersUI vouchers={vouchers} deleteVoucher={deleteVoucher} filteringByStatus={filteringByStatus} />
              {pageCount > 1 && <Pagination pageCount={pageCount} initialPage={currentPage} onPageChange={this.handleChangePage} />}
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default Vouchers;
