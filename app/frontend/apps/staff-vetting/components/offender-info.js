import React, { Component } from 'react';
import oFetch from 'o-fetch';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { openContentModal, MODAL_TYPE1 } from '~/components/modals';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';

momentDurationFormatSetup(moment);

class OffenderHistoryModalContent extends Component {
  render() {
    const [staffMemberId, history] = oFetch(this.props, 'staffMemberId', 'history');

    return (
      <div className="boss-modal-window__overview">
        <div className="boss-overview">
          <div className="boss-overview__group">
            <ul className="boss-overview__activity">
              {history.map((item, index) => {
                const [dodgedMinutes, weekStart] = oFetch(item, 'dodgedMinutes', 'weekStart');
                const formattedDate = safeMoment.uiDateParse(weekStart).format(utils.commonDateFormatWithDay());
                const formattedTime = moment
                  .duration(dodgedMinutes, 'minutes')
                  .format('*h[h] m[m]', { trim: 'both', useGrouping: false });
                return (
                  <li key={index} className="boss-overview__activity-item">
                    <p className="boss-overview__text">
                      {formattedDate} - <span className="boss-overview__text-marked">{formattedTime}</span>
                    </p>
                    <a href="#" className="boss-overview__link boss-overview__link_role_details">
                      Details
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default class OffenderInfo extends Component {
  handleOpenHistoryModal = (fullName, history, staffMemberId) => {
    openContentModal({
      submit: this.handleMarkHandledClick,
      config: {
        title: (
          <span>
            <span className="boss-modal-window__marked">{fullName}</span> Offences
          </span>
        ),
        type: MODAL_TYPE1,
        modalClassName: 'boss-modal-window_role_offences',
      },
      props: { history, staffMemberId },
    })(OffenderHistoryModalContent);
  };

  render() {
    const onMarkHandledClick = oFetch(this.props, 'onMarkHandledClick');
    const offender = oFetch(this.props, 'offender');
    const [staffMemberId, avatarUrl, fullName, offenceLevel, staffType, venue, markNeeded, history] = oFetch(
      offender,
      'staffMemberId',
      'avatarUrl',
      'fullName',
      'offenceLevel',
      'staffType',
      'venue',
      'markNeeded',
      'history',
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
                  <button
                    type="button"
                    onClick={() => this.handleOpenHistoryModal(fullName, history, staffMemberId)}
                    className="boss-user-summary__review-link"
                  >
                    {offenceLevel}
                  </button>
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
