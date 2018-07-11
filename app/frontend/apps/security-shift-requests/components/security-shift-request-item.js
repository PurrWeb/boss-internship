import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AsyncButton from 'react-async-button';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';
import { appRoutes } from '~/lib/routes';
import utils from '~/lib/utils';

function getFormattedTimeOnly(isoString) {
  return safeMoment.iso8601Parse(isoString).format(utils.commonDateFormatTimeOnly());
}

function getFormattedDate(startsAt, endsAt) {
  return utils.intervalRotaDatesFormat(safeMoment.iso8601Parse(startsAt), safeMoment.iso8601Parse(endsAt));
}

class SecurityShiftRequestItem extends Component {
  chekIfStartsAtChanged = (createdShift, PreviousStartsAt) => {
    if (!createdShift) {
      throw new Error('No created Shift');
    } else if (!PreviousStartsAt) {
      throw new Error('No startsAt');
    } else {
      const createdShiftStartsAt = oFetch(createdShift, 'startsAt');
      const isStartsAtChanged = createdShiftStartsAt !== PreviousStartsAt;
      return isStartsAtChanged;
    }
  };

  chekIfEndsAtChanged = (createdShift, previousEndsAt) => {
    if (!createdShift) {
      throw new Error('No created Shift');
    } else if (!previousEndsAt) {
      throw new Error('No endsAt');
    } else {
      const createdShiftEndsAt = oFetch(createdShift, 'endsAt');
      const isEndsAtChanged = createdShiftEndsAt !== previousEndsAt;
      return isEndsAtChanged;
    }
  };

  renderCreatedShift(createdShift) {
    const firstName = oFetch(createdShift, 'staffMember.firstName');
    const surname = oFetch(createdShift, 'staffMember.surname');
    const fullName = `${firstName} ${surname}`;
    const startsAt = oFetch(createdShift, 'startsAt');
    const endsAt = oFetch(createdShift, 'endsAt');
    const mStartsAtDate = safeMoment.iso8601Parse(startsAt);
    const startsAtDate = mStartsAtDate.format(utils.commonDateFormat);
    const venueId = oFetch(createdShift, 'venueId');

    const securityShiftRequest = oFetch(this.props, 'securityShiftRequest');
    const shiftRequestStartsAt = oFetch(securityShiftRequest, 'startsAt');
    const shiftRequestEndsAt = oFetch(securityShiftRequest, 'endsAt');

    const isStartsAtChanged = startsAt !== shiftRequestStartsAt;
    const isEndsAtChanged = endsAt !== shiftRequestEndsAt;
    return (
      <div className="boss-table__info">
        <p className="boss-table__label">Rotaed Shift</p>
        <div className="boss-table__info-group">
          <p className="boss-table__text">
            <span className="boss-table__text-line">{fullName}</span>
            <span className="boss-table__text-line">
              <div>{safeMoment.iso8601Parse(startsAt).format(utils.commonDateFormatCalendar())}</div>
              {isStartsAtChanged ? (
                <span className="boss-table__text-alert">{getFormattedTimeOnly(startsAt)}</span>
              ) : (
                getFormattedTimeOnly(startsAt)
              )}
              {' - '}
              {isEndsAtChanged ? (
                <span className="boss-table__text-alert">{getFormattedTimeOnly(endsAt)}</span>
              ) : (
                getFormattedTimeOnly(endsAt)
              )}
            </span>
          </p>
          <div className="boss-table__actions">
            <a
              target="_blank"
              href={appRoutes.rota({ venueId: venueId, date: mStartsAtDate })}
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

    const isStartsAtChanged = createdShift && this.chekIfStartsAtChanged(createdShift, startsAt);
    const isEndsAtChanged = createdShift && this.chekIfEndsAtChanged(createdShift, endsAt);

    const isEdited = createdShift && (isStartsAtChanged || isEndsAtChanged);

    const isEditedClass = isEdited ? 'boss-table__row_state_edited' : '';
    return (
      <div className={`boss-table__row ${isEditedClass}`}>
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__label">Requested times</p>
            <p className="boss-table__text">
              {getFormattedDate(startsAt, endsAt)}
            </p>
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
                <AsyncButton
                  text="Delete"
                  pendingText="Deleting..."
                  onClick={onDeleteSecurityShiftRequest}
                  type="button"
                  className="boss-button boss-button_role_cancel-light boss-button_type_extra-small boss-table__action"
                />
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
