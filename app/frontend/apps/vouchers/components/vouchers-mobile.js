import React from 'react';

export default class VouchersMobileItem extends React.Component {
  constructor(props) {
    super(props);
  }

  deleteVoucher = (item) => {
    this.props.deleteVoucher(item.get('id'));
  }

  render() {
    const {
      item
    } = this.props

    const isVoucherEnabled = item.get('enabled');
    const voucherStatus = isVoucherEnabled ? 'Active' : 'Deleted';
    const voucherUsages = item.get('usages');
    const voucherDescription = item.get('description');
    const voucherVenue = item.get('venue_name');
    const voucherId = item.get('id');

    return <div className="boss-check boss-check_role_board boss-check_page_vouchers-index">
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className="boss-check__text boss-check__text_role_voucher boss-check__text_marked">{voucherDescription}</p>
        </div>
      </div>
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className="boss-check__text boss-check__text_role_venue boss-check__text_marked">{voucherVenue}</p>
        </div>
      </div>
      <div className="boss-check__row">
        <a href={`/vouchers/${voucherId}/usages`} className="boss-check__cell boss-check__cell_size_half">
          <p className="boss-check__text">
            <button className="boss-button">View</button>
            <span>Used: {voucherUsages}</span>
          </p>
        </a>
        <div className="boss-check__cell boss-check__cell_size_half">
          <p className="boss-check__text">Status: {voucherStatus}</p>
        </div>
      </div>
      <div className="boss-check__row">
        <div className="boss-check__cell">
          { isVoucherEnabled && <button
              type="button"
              onClick={() => (this.props.onDelete(item.get('id')))}
              className="boss-button boss-button_role_cancel boss-table__action"
            >Delete</button>
          }
        </div>
      </div>
   </div>
  }
}
