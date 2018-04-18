import React, { Component } from 'react';
import oFetch from 'o-fetch';
import humanize from 'string-humanize';
import AsyncButton from 'react-async-button';
import errorHandler from '~/lib/error-handlers';

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
    errors: []
  }

  onButtonClick = (action) => {
    this.setState({
      isSending: true,
      errors: []
    })
    return action().catch((payload) => {
      this.setState({
        isSending: false
      });

      const response = payload.response;
      if(response && (response.status == 422)) {
        const errors = oFetch(response, 'data.errors.base')
        this.setState({ errors: errors });
      } else {
        if (Rollbar) {
          Rollbar.error("Unexpected response code encountered", payload);
        }
        if (typeof window.console !== 'undefined') {
          window.console.error(payload);
        }
        errorHandler.throwErrorPage();
      }
    });
  }

  render() {
    const viewReportUrl = oFetch(this.props, 'viewReportUrl');
    const holidayRequest = oFetch(this.props, 'holidayRequest');
    const holidayRequestId = oFetch(holidayRequest, 'id');
    const holidayType = oFetch(holidayRequest, 'holidayType');
    const mStartDate = safeMoment.uiDateParse(oFetch(holidayRequest, 'startDate'));
    const mEndDate = safeMoment.uiDateParse(oFetch(holidayRequest, 'endDate'));
    const note = oFetch(holidayRequest, 'note');

    const formattedDate = `${mStartDate.format('ddd DD-MM-YYYY')} - ${mEndDate.format('ddd DD-MM-YYYY')}`;
    const days = mEndDate.diff(mStartDate, 'days') + 1;
    const formattedDays = days > 1 ? `( ${days} days )` : `( ${days} day )`;

    const onAcceptClick = oFetch(this.props, 'onAcceptClick');
    const onRejectClick = oFetch(this.props, 'onRejectClick');
    const errors = oFetch(this.state, 'errors');

    return (
      <div className="boss-table__group">
        { (errors.length) > 0 && <div className="boss-alert boss-alert_role_area">
          <p className="boss-alert__text">
            { errors.map((error, index) => {
                return <span key={`request:${holidayRequestId}errorMessage${index}`} className="boss-alert__text-line">{error}.</span>

              })
            }
          </p>
        </div> }
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
      </div>
    );
  }
}

export default HolidayRequestsItem;
