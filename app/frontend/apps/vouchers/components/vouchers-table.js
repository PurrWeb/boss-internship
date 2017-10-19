import React from 'react';

const VouchersTableItem = ({item, onDelete, filteringByStatus}) => {

    const isVoucherEnabled = item.get('enabled');
    const voucherStatus = isVoucherEnabled ? 'Active' : 'Deleted';
    const voucherUsages = item.get('usages');
    const voucherDescription = item.get('description');
    const voucherVenue = item.get('venue_name');
    const voucherId = item.get('id');

    return <div className="boss-table__row">
        <div className="boss-table__cell">
            <div className="boss-table__info">
                <p className="boss-table__label">Venue</p>
                <p className="boss-table__text"><a href="#" className="boss-table__link">{voucherVenue}</a></p>
            </div>
        </div>
        <div className="boss-table__cell">
            <div className="boss-table__info">
                <p className="boss-table__label">Description</p>
                <p className="boss-table__text">{voucherDescription}</p>
            </div>
        </div>
        <a href={`/vouchers/${voucherId}/usages`} className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Usage</p>
            <p className="boss-table__text">
              <button className="boss-button">View</button> {voucherUsages}
            </p>
          </div>
        </a>
        { !filteringByStatus && <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">Status</p>
              <p className="boss-table__text">{voucherStatus}</p>
            </div>
          </div>
        }
        <div className="boss-table__cell">
            <div className="boss-table__info">
                <p className="boss-table__label">Action</p>
                <div className="boss-table__actions">
                  { isVoucherEnabled && <button
                      type="button"
                      onClick={() => onDelete(item.get('id'))}
                      className="boss-button boss-button_role_cancel boss-table__action"
                    >Delete</button>
                  }
                </div>
            </div>
        </div>
    </div>
}

export default class VouchersTable extends React.Component {
  constructor(props){
    super(props);
  };

  renderTableItems = (items, onDelete, filteringByStatus) => {
    return items.map((item, key) => {
      return <VouchersTableItem key={key} item={item} onDelete={onDelete} filteringByStatus={filteringByStatus}/>
    });
  };

  render() {
    const {
      vouchers,
      onDelete,
      filteringByStatus
    } = this.props
    return <div className="boss-table boss-table_page_vouchers-index">
      <div className="boss-table__row">
        <div className="boss-table__cell boss-table__cell_role_header">Venue</div>
        <div className="boss-table__cell boss-table__cell_role_header">Description</div>
        <div className="boss-table__cell boss-table__cell_role_header">Usage</div>
        { !filteringByStatus && <div className="boss-table__cell boss-table__cell_role_header">Status</div> }
        <div className="boss-table__cell boss-table__cell_role_header">Action</div>
      </div>
      {this.renderTableItems(vouchers, onDelete, filteringByStatus)}
    </div>
  }
};
