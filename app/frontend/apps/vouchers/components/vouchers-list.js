import React from 'react';
import VouchersTable from './vouchers-table';
import VouchersMobileItem from './vouchers-mobile';
import confirm from '~/lib/confirm-utils';

export default class VoucherUI extends React.Component {
  constructor(props) {
    super(props)
  };

  onDelete = (id) => {
    confirm('Are you sure ?', {
      title: 'WARNING !!!',
      actionButtonText: 'Delete',
    }).then(() => {
      this.props.deleteVoucher(id);
    });
  }

  renderMobileItems = (items) => {
    return items.map((item, key) => {
      return <VouchersMobileItem key={key} item={item} deleteVoucher={this.onDelete} filteringByStatus={this.props.filteringByStatus}/>
    });
  }

  render() {
    const {
      vouchers
    } = this.props

    return <div className="boss-page-main__group boss-page-main__group_adjust_vouchers-index-table">
      <div className="boss-table boss-table_page_vouchers-index">
        <VouchersTable vouchers={vouchers} onDelete={this.onDelete} filteringByStatus={this.props.filteringByStatus}/>
      </div>
      {this.renderMobileItems(vouchers)}
    </div>
  };
};
