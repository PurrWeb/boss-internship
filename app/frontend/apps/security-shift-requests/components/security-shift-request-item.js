import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';
import { appRoutes } from '~/lib/routes';
import utils from '~/lib/utils';

function getFormattedDate(startsAt, endsAt) {
  return utils.intervalRotaDatesFormat(startsAt, endsAt);
}

class SecurityShiftRequestItem extends Component {
  renderCreatedShift(createdShift) {
    const firstName = oFetch(createdShift, 'staffMember.firstName');
    const surname = oFetch(createdShift, 'staffMember.surname');
    const fullName = `${firstName} ${surname}`;
    const startsAt = oFetch(createdShift, 'startsAt');
    const endsAt = oFetch(createdShift, 'endsAt');
    const startsAtDate = safeMoment.iso8601Parse(startsAt).format(utils.commonDateFormat);

    return (
      <div className="boss-table__info">
        <p className="boss-table__label">Rotaed Shift</p>
        <div className="boss-table__info-group">
          <p className="boss-table__text">
            <span className="boss-table__text-line">{fullName}</span>
            <span className="boss-table__text-line">{getFormattedDate(startsAt, endsAt)}</span>
          </p>
          <div className="boss-table__actions">
            <a
              target="_blank"
              href={appRoutes.securityRotaDaily(startsAtDate)}
              className="boss-button boss-button_type_extra-small boss-button_role_view-details-light"
            >
              View Rota
            </a>
          </div>
        </div>
      </div>
    );
  }

  renderRejectMessage(rejectReason) {
    return (
      <div className="boss-table__box boss-table__box_role_alert">
        <p className="boss-table__text">
          <span className="boss-table__text-line boss-table__text-marked">Reason for Rejecting:</span>
          <span className="boss-table__text-line">{rejectReason}</span>
        </p>
      </div>
    );
  }

  render() {
    const securityShiftRequest = oFetch(this.props, 'securityShiftRequest');
    const onOpenEditSecurityShiftRequest = oFetch(this.props, 'onOpenEditSecurityShiftRequest');
    const onDeleteSecurityShiftRequest = oFetch(this.props, 'onDeleteSecurityShiftRequest');
    const startsAt = oFetch(securityShiftRequest, 'startsAt');
    const endsAt = oFetch(securityShiftRequest, 'endsAt');
    const status = oFetch(securityShiftRequest, 'status');
    const note = oFetch(securityShiftRequest, 'note');
    const createdShift = oFetch(securityShiftRequest, 'createdShift');
    const isCompleted = oFetch(this.props, 'isCompleted');
    const permissions = oFetch(securityShiftRequest, 'permissions');
    const isEditable = oFetch(permissions, 'isEditable');
    const isDeletable = oFetch(permissions, 'isDeletable');
    const rejectReason = oFetch(securityShiftRequest, 'rejectReason');

    return (
      <div className="boss-table__row">
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Requested times</p>
            <p className="boss-table__text">{getFormattedDate(startsAt, endsAt)}</p>
          </div>
        </div>
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Note</p>
            <div className="boss-table__info-group">
              <p className="boss-table__text">{note}</p>
              {status === 'rejected' && this.renderRejectMessage(rejectReason)}
            </div>
          </div>
        </div>
        {isCompleted && <div className="boss-table__cell">{createdShift && this.renderCreatedShift(createdShift)}</div>}
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Status</p>
            <div className="boss-table__actions">
              <p
                style={{ textTransform: 'capitalize' }}
                className={`boss-button boss-button_role_${status.toLowerCase()} boss-button_type_extra-small boss-table__action boss-button_type_no-behavior`}
              >
                {status}
              </p>
            </div>
          </div>
        </div>
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Actions</p>
            <div className="boss-table__actions">
              {isEditable && (
                <button
                  onClick={onOpenEditSecurityShiftRequest}
                  type="button"
                  className="boss-button boss-button_role_edit-light boss-button_type_extra-small boss-table__action"
                >
                  Edit
                </button>
              )}
              {isDeletable && (
                <button
                  onClick={onDeleteSecurityShiftRequest}
                  type="button"
                  className="boss-button boss-button_role_cancel-light boss-button_type_extra-small boss-table__action"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SecurityShiftRequestItem.propTypes = {
  securityShiftRequest: PropTypes.shape({
    startsAt: PropTypes.string.isRequired,
    endsAt: PropTypes.string.isRequired,
    note: PropTypes.string,
    status: PropTypes.string.isRequired,
    rotaShiftId: PropTypes.number,
  }),
  onOpenEditSecurityShiftRequest: PropTypes.func.isRequired,
  isCompleted: PropTypes.bool,
};

SecurityShiftRequestItem.defaultProps = {
  isCompleted: false,
};

export default SecurityShiftRequestItem;
