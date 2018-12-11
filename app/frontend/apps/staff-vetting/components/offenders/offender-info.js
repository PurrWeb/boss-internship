import React, { Component } from 'react';
import oFetch from 'o-fetch';

export default class OffenderInfo extends Component {
  render() {
    const [onMarkHandledClick, onHistoryDetailsClick, onReviewHistoryClick] = oFetch(
      this.props,
      'onMarkHandledClick',
      'onHistoryDetailsClick',
      'onReviewHistoryClick',
    );
    const offender = oFetch(this.props, 'offender');
    const [staffMemberId, fullName, staffType, venue, markNeeded, history, reviewHistory] = oFetch(
      offender,
      'staffMemberId',
      'fullName',
      'staffType',
      'venue',
      'markNeeded',
      'history',
      'reviewHistory',
    );

    const offencesCount = history.length;
    const hasReviewHistory = reviewHistory.length !== 0;

    return (
      <div className="boss-user-summary__content">
        <div className="boss-user-summary__header">
          <h2 className="boss-user-summary__name">{fullName}</h2>
        </div>
        <ul className="boss-user-summary__review-list">
          <li className="boss-user-summary__review-item">
            <span className="boss-user-summary__review-label">Staff Type: </span>
            <span className="boss-user-summary__review-val boss-user-summary__review-val_marked">
              {oFetch(staffType, 'name')}
            </span>
          </li>
          <li className="boss-user-summary__review-item">
            <span className="boss-user-summary__review-label">Master Venue: </span>
            <span className="boss-user-summary__review-val boss-user-summary__review-val_marked">{venue}</span>
          </li>
          <li className="boss-user-summary__review-item">
            <span className="boss-user-summary__review-label">Offences Count: </span>
            <span className="boss-user-summary__review-val">
              <button
                type="button"
                onClick={() => onHistoryDetailsClick(fullName, history, staffMemberId)}
                className="boss-user-summary__review-link"
              >
                {offencesCount}
              </button>
            </span>
          </li>
          {hasReviewHistory && (
            <li className="boss-user-summary__review-item">
              <button
                onClick={() => onReviewHistoryClick(fullName, reviewHistory)}
                type="button"
                className="boss-user-summary__link boss-user-summary__link_role_data"
              >
                Reviews
              </button>
            </li>
          )}
        </ul>
        {markNeeded && (
          <div className="boss-user-summary__actions">
            <button
              onClick={() => onMarkHandledClick(staffMemberId)}
              type="button"
              className="boss-button boss-button_role_alert boss-button_type_extra-small boss-user-summary__action"
            >
              Mark Handled
            </button>
          </div>
        )}
      </div>
    );
  }
}

OffenderInfo.defaultProps = {
  onMarkHandledClick: null,
};
