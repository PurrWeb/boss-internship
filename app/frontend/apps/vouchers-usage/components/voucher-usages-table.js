import React from 'react';
import oFetch from 'o-fetch';
import moment from 'moment';
import utils from '~/lib/utils';

export default function VoucherUsagesTableItem({items}) {

  const renderTableItem = (item, key) => {
    const staffMemberName = oFetch(item, 'staff_member');
    const masterVenueName = oFetch(item, 'venue_name');
    const createdTime = moment(oFetch(item, 'created_at')).format(utils.humanDateFormatWithTime());

    return (
      <div key={key} className="boss-table__row">
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Staff Member</p>
            <p className="boss-table__text">{staffMemberName}</p>
          </div>
        </div>
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Master Venue</p>
            <p className="boss-table__text">{masterVenueName}</p>
          </div>
        </div>
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Time</p>
            <p className="boss-table__text">{createdTime}</p>
          </div>
        </div>
      </div>
    )
  }

  const renderTableItems = (items) => {
    return items.map((item, key) => {
      return renderTableItem(item, key)
    });
  };

  return (
    <div className="boss-table boss-table_page_voucher-usage">
      <div className="boss-table__row">
        <div className="boss-table__cell boss-table__cell_role_header">Staff Member</div>
        <div className="boss-table__cell boss-table__cell_role_header">Master Venue</div>
        <div className="boss-table__cell boss-table__cell_role_header">Time</div>
      </div>
      {renderTableItems(items)}
    </div>
  )
};
