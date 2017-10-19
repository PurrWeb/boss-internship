import React from 'react';
import oFetch from 'o-fetch';
import moment from 'moment';
import utils from '~/lib/utils';

export default function VoucherUsagesMobileItem({item}) {
  const staffMemberName = oFetch(item, 'staff_member');
  const masterVenueName = oFetch(item, 'venue_name');
  const createdTime = moment(oFetch(item, 'created_at')).format(utils.humanDateFormatWithTime());

  return (
    <div className="boss-check boss-check_role_board boss-check_page_voucher-usage">
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className="boss-check__text boss-check__text_role_user boss-check__text_role_main">{staffMemberName}</p>
        </div>
      </div>
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className="boss-check__text boss-check__text_role_venue boss-check__text_role_main">{masterVenueName}</p>
        </div>
      </div>
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className="boss-check__text">{createdTime}</p>
        </div>
      </div>
    </div>
  )
}
