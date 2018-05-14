import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AsyncButton from 'react-async-button';
import oFetch from 'o-fetch';
import moment from 'moment';
import utils from '~/lib/utils';

class AssignConfirm extends PureComponent {
  render() {
    const avatarUrl = oFetch(this.props, 'avatarUrl');
    const fullName = oFetch(this.props, 'fullName');
    const shiftRequest = oFetch(this.props, 'shiftRequest');
    const startsAt = oFetch(shiftRequest, 'startsAt');
    const endsAt = oFetch(shiftRequest, 'endsAt');
    const venueName = oFetch(shiftRequest, 'venueName');
    const staffMemberId = oFetch(this.props, 'staffMemberId');
    const onSubmit = oFetch(this.props, 'onSubmit');
    return (
      <div>
        <div className="boss-modal-window__message-block">
          <div className="boss-user-summary boss-user-summary_role_ssr-assign-confirmation">
            <div className="boss-user-summary__side">
              <div className="boss-user-summary__avatar">
                <div className="boss-user-summary__avatar-inner">
                  <img
                    src={avatarUrl}
                    alt="John Doe"
                    className="boss-user-summary__pic"
                  />
                </div>
              </div>
            </div>
            <div className="boss-user-summary__content">
              <div className="boss-user-summary__header">
                <h2 className="boss-user-summary__name">{fullName}</h2>
              </div>
              <ul className="boss-user-summary__review-list">
                <li className="boss-user-summary__review-item boss-user-summary__review-item_role_time">
                  {utils.intervalRotaDatesFormat(startsAt, endsAt)}
                </li>
                <li className="boss-user-summary__review-item boss-user-summary__review-item_role_venue">
                  {venueName}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="boss-modal-window__actions">
          <AsyncButton
            text="Confirm"
            pendingText="Confirming ..."
            onClick={() => onSubmit(staffMemberId)}
            className="boss-button boss-button_role_confirm"
          />
        </div>
      </div>
    );
  }
}

AssignConfirm.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  shiftRequest: PropTypes.object.isRequired,
};

export default AssignConfirm;
