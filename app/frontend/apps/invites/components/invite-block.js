import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';
import pureToJS from '~/hocs/pure-to-js';
import { OPEN_STATUS } from '../constants';
import humanize from 'string-humanize';

class InviteBlock extends Component {
  onBouncedEmailClick = () => {
    const invite = oFetch(this.props, 'invite');
    const { bouncedEmailData } = invite;
    this.props.handleBouncedEmailInfoClick(bouncedEmailData);
  };

  render() {
    const invite = oFetch(this.props, 'invite');
    const onRevoke = oFetch(this.props, 'onRevoke');
    const inviteId = oFetch(invite, 'id');
    const venueNames = oFetch(invite, 'venueNames');
    const currentState = oFetch(invite, 'currentState');
    const email = oFetch(invite, 'email');
    const role = oFetch(invite, 'role');
    const inviterFullName = oFetch(invite, 'inviterFullName');
    const createdAt = oFetch(invite, 'createdAt');
    const canBeRevoked = currentState === OPEN_STATUS;
    const { bouncedEmailData } = invite;
    return (
      <div className="boss-check boss-check_role_board boss-check_page_invites-index">
        <div className="boss-check__row">
          <div className="boss-check__cell">
            {bouncedEmailData ? (
              <h3
                onClick={this.handleBouncedEmailClick}
                className="boss-check__title boss-check__title_role_alert-action boss-check__title_adjust_wrap"
              >
                {email}
              </h3>
            ) : (
              <h3 className="boss-check__title boss-check__title_adjust_wrap">{email}</h3>
            )}
          </div>
        </div>
        <div className="boss-check__row boss-check__row_marked">
          <div className="boss-check__info-table">
            <div className="boss-check__info-row">
              <div className="boss-check__info-cell">
                <p className="boss-check__text">Role</p>
              </div>
              <div className="boss-check__info-cell">
                <p className="boss-check__text boss-check__text_role_primary">{humanize(role)}</p>
              </div>
            </div>
            <div className="boss-check__info-row">
              <div className="boss-check__info-cell">
                <p className="boss-check__text">Venues</p>
              </div>
              <div className="boss-check__info-cell">
                <p className="boss-check__text boss-check__text_role_primary boss-check__text_role_venue">
                  {venueNames}
                </p>
              </div>
            </div>
            <div className="boss-check__info-row">
              <div className="boss-check__info-cell">
                <p className="boss-check__text">Status</p>
              </div>
              <div className="boss-check__info-cell">
                <p className="boss-check__text boss-check__text_role_primary">{humanize(currentState)}</p>
              </div>
            </div>
            <div className="boss-check__info-row">
              <div className="boss-check__info-cell">
                <p className="boss-check__text">Inviter</p>
              </div>
              <div className="boss-check__info-cell">
                <p className="boss-check__text boss-check__text_role_primary boss-check__text_role_user">
                  {inviterFullName}
                </p>
              </div>
            </div>
            <div className="boss-check__info-row">
              <div className="boss-check__info-cell">
                <p className="boss-check__text">Invited At</p>
              </div>
              <div className="boss-check__info-cell">
                <p className="boss-check__text boss-check__text_role_primary boss-check__text_role_date">
                  {safeMoment.iso8601Parse(createdAt).format(utils.commonDateFormatCalendar())}
                </p>
              </div>
            </div>
          </div>
        </div>
        {canBeRevoked && (
          <div className="boss-check__row boss-check__row_role_buttons">
            <button
              onClick={() => onRevoke(inviteId)}
              type="button"
              className="boss-button boss-button_role_cancel boss-check__button"
            >
              Revoke
            </button>
          </div>
        )}
      </div>
    );
  }
}

InviteBlock.propTypes = {
  invite: PropTypes.object.isRequired,
  onRevoke: PropTypes.func.isRequired,
  handleBouncedEmailInfoClick: PropTypes.func.isRequired,
};

export default InviteBlock;

export const PureJSInviteBlock = pureToJS(InviteBlock);
