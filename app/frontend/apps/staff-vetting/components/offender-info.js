import React, { Component } from 'react';
import oFetch from 'o-fetch';

export default class OffenderInfo extends Component {
  render() {
    const onMarkHandledClick = oFetch(this.props, 'onMarkHandledClick');
    const offender = oFetch(this.props, 'offender');
    const [staffMemberId, avatarUrl, fullName, offenceLevel, staffType, venue, markNeeded] = oFetch(
      offender,
      'staffMemberId',
      'avatarUrl',
      'fullName',
      'offenceLevel',
      'staffType',
      'venue',
      'markNeeded',
    );

    return (
      <div className="boss-users__flow-item">
        <div className="boss-user-summary boss-user-summary_role_review-short">
          <div className="boss-user-summary__side">
            <div className="boss-user-summary__avatar">
              <div className="boss-user-summary__avatar-inner">
                <img src={avatarUrl} alt={fullName} className="boss-user-summary__pic" />
              </div>
            </div>
          </div>
          <div className="boss-user-summary__content">
            <div className="boss-user-summary__header">
              <h2 className="boss-user-summary__name">{fullName}</h2>
            </div>
            <ul className="boss-user-summary__review-list">
              <li className="boss-user-summary__review-item">
                <span className="boss-user-summary__review-label">Staff Type: </span>
                <span className="boss-user-summary__review-val boss-user-summary__review-val_marked">{staffType}</span>
              </li>
              <li className="boss-user-summary__review-item">
                <span className="boss-user-summary__review-label">Master Venue: </span>
                <span className="boss-user-summary__review-val boss-user-summary__review-val_marked">{venue}</span>
              </li>
              <li className="boss-user-summary__review-item">
                <span className="boss-user-summary__review-label">Offences Count: </span>
                <span className="boss-user-summary__review-val">
                  <a href="#" className="boss-user-summary__review-link">
                    {offenceLevel}
                  </a>
                </span>
              </li>
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
        </div>
      </div>
    );
  }
}
