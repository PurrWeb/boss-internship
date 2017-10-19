import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import VoucherUsagesList from '../components/voucher-usages-list';
import VoucherUsagesDashboard from '../components/voucher-usages-dashboard';
import VoucherUsagesFilter from '../components/voucher-usages-filter';
import Pagination from '~/components/pagination.js';

const mapStateToProps = (state) => {
  return {
    usages: state.getIn(['page','usages']),
    voucher: state.getIn(['page','voucher']),
    startDate: state.getIn(['page','filter', 'startDate']),
    endDate: state.getIn(['page','filter', 'endDate']),
    currentPage: state.getIn(['page','pagination', 'currentPage']),
    pageCount: state.getIn(['page','pagination', 'pageCount']),
  };
}

@connect(mapStateToProps)
class VoucherUsages extends React.Component {
  handleChangePage = (value) => {
    let queryParams = new URLSearchParams(window.location.search);
    queryParams.set('page', value);
    const link = `${window.location.href.split('?')[0]}?${queryParams.toString()}`
    window.location.href = link;
  }

  render() {
    return (
      <div>
        <VoucherUsagesDashboard
          key="header"
          title="Voucher Usage"
          voucher={this.props.voucher.toJS()}
        />
        <div key="content" className="boss-page-main__content">
          <div className="boss-page-main__inner">
            <VoucherUsagesFilter
              dateTitle="Used"
              startDate={this.props.startDate}
              endDate={this.props.endDate}
            />
            <VoucherUsagesList items={this.props.usages.toJS()} />
            {this.props.pageCount > 1 && <Pagination pageCount={this.props.pageCount} initialPage={this.props.currentPage} onPageChange={this.handleChangePage} />}
          </div>
        </div>
      </div>
    )
  }
}

export default VoucherUsages
