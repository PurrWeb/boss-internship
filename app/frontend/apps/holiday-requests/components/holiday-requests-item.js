import React, { Component } from 'react';
import oFetch from 'o-fetch';
import humanize from 'string-humanize';
import AsyncButton from 'react-async-button';

import safeMoment from '~/lib/safe-moment';

function Cell({ label, text, children }) {
  return (
    <div className="boss-table__cell">
      <div className="boss-table__info">
        <div className="boss-table__label">{label}</div>
        {children ? children : <p className="boss-table__text">{text}</p>}
      </div>
    </div>
  );
}

class HolidayRequestsItem extends Component {
  state = {
    isSending: false,
  }

  onButtonClick = (action) => {
    this.setState({ isSending: true })
    return action().catch(() => {
      this.setState({ isSending: false });
    });
  }

  render() {
    const viewReportUrl = oFetch(this.props, 'viewReportUrl');
    const holidayRequest = oFetch(this.props, 'holidayRequest');
    const holidayType = oFetch(holidayRequest, 'holidayType');
    const mStartDate = safeMoment.uiDateParse(oFetch(holidayRequest, 'startDate'));
    const mEndDate = safeMoment.uiDateParse(oFetch(holidayRequest, 'endDate'));
    const note = oFetch(holidayRequest, 'note');

    const formattedDate = `${mStartDate.format('ddd DD-MM-YYYY')} - ${mEndDate.format('ddd DD-MM-YYYY')}`;
    const days = mEndDate.diff(mStartDate, 'days') + 1;
    const formattedDays = days > 1 ? `( ${days} days )` : `( ${days} day )`;

    const onAcceptClick = oFetch(this.props, 'onAcceptClick');
    const onRejectClick = oFetch(this.props, 'onRejectClick');

    return (
      <div className="boss-table__row">
        <Cell label="Type" text={humanize(holidayType)} />
        <Cell label="Dates">
          <p className="boss-table__text">
            <span className="boss-table__text-line">{formattedDate}</span>
            <span className="boss-table__text-meta">{formattedDays}</span>
          </p>
        </Cell>
        <Cell label="Note" text={note} />
        <Cell label="Holidays Report">
          <div className="boss-table__actions">
            <a href={viewReportUrl} className="boss-button boss-button_role_view-report boss-button_type_extra-small">
              View Report
            </a>
          </div>
        </Cell>
        <Cell label="Action">
          <div className="boss-table__actions">
            <AsyncButton
              disabled={this.state.isSending}
              className="boss-button boss-button_type_extra-small boss-button_role_success boss-table__action"
              text="Accept"
              pendingText="Accepting ..."
              onClick={() => this.onButtonClick(onAcceptClick)}
            />
            <AsyncButton
              disabled={this.state.isSending}
              className="boss-button boss-button_type_extra-small boss-button_role_cancel-light boss-table__action"
              text="Reject"
              pendingText="Rejecting ..."
              onClick={() => this.onButtonClick(onRejectClick)}
            />
          </div>
        </Cell>
      </div>
    );
  }
}

export default HolidayRequestsItem;
