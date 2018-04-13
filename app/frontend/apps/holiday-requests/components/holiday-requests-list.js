import React, { Component } from 'react';
import oFetch from 'o-fetch';

class HolidayRequestList extends Component {
  renderItems(holidayRequests) {
    const itemRenderer = oFetch(this.props, 'itemRenderer')

    return holidayRequests.map(holidayRequest => {
      const jsHolidayRequest = holidayRequest.toJS();
      const holidayRequestId = oFetch(jsHolidayRequest, 'id');

      return React.cloneElement(itemRenderer(jsHolidayRequest), {
        key: holidayRequestId.toString(),
      })
    })
  }

  render() {
    const holidayRequests = oFetch(this.props, 'holidayRequests');

    return (
      <div className="boss-check__row boss-check__row_marked">
        <div className="boss-check__table">
          <div className="boss-table boss-table_page_holiday-requests">
            <div className="boss-table__row">
              <div className="boss-table__cell boss-table__cell_role_header">Types</div>
              <div className="boss-table__cell boss-table__cell_role_header">Dates</div>
              <div className="boss-table__cell boss-table__cell_role_header">Note</div>
              <div className="boss-table__cell boss-table__cell_role_header">Holidays Report</div>
              <div className="boss-table__cell boss-table__cell_role_header">Action</div>
            </div>
            {this.renderItems(holidayRequests)}
          </div>
        </div>
      </div>
    );
  }
}

export default HolidayRequestList;
