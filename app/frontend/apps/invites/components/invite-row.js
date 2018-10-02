import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';
import pureToJS from '~/hocs/pure-to-js';
import { OPEN_STATUS } from '../constants';
import humanize from 'string-humanize';

class InviteRow extends Component {
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
      <div className="boss-table__row">
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Email</p>
            {bouncedEmailData ? (
              <p
                onClick={this.handleBouncedEmailInfoClick}
                className="boss-table__text boss-table__text_role_alert-action boss-table__text_adjust_wrap"
              >
                {email}
              </p>
            ) : (
              <p className="boss-table__text boss-table__text_adjust_wrap">{email}</p>
            )}
          </div>
        </div>
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Role</p>
            <p className="boss-table__text">{humanize(role)}</p>
          </div>
        </div>
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Venues</p>
            <p className="boss-table__text">{venueNames}</p>
          </div>
        </div>
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Status</p>
            <p className="boss-table__text">{humanize(currentState)}</p>
          </div>
        </div>
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Inviter</p>
            <p className={`"boss-table__text"`}>{inviterFullName}</p>
          </div>
        </div>
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Invited At</p>
            <p className="boss-table__text">
              {safeMoment.iso8601Parse(createdAt).format(utils.commonDateFormatCalendar())}
            </p>
          </div>
        </div>
        <div className="boss-table__cell">
          {canBeRevoked && (
            <div className="boss-table__info">
              <p className="boss-table__label">Action</p>
              <div className="boss-table__actions">
                <button
                  onClick={() => onRevoke(inviteId)}
                  type="button"
                  className="boss-button boss-button_role_cancel boss-button_type_small boss-table__action"
                >
                  Revoke
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

InviteRow.propTypes = {
  invite: PropTypes.object.isRequired,
  onRevoke: PropTypes.func.isRequired,
  handleBouncedEmailInfoClick: PropTypes.func.isRequired,
};

export default InviteRow;

export const PureJSInviteRow = pureToJS(InviteRow);
