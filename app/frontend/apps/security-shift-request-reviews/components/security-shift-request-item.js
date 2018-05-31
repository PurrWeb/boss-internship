import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import moment from 'moment';
import AsyncButton from 'react-async-button';
import RotaDate from '~/lib/rota-date';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';
import { appRoutes } from '~/lib/routes';
import utils from '~/lib/utils';
import { openContentModal } from '~/components/modals';
import EditSecurityShiftRequest from './edit-security-shift-request';
import RejectSecurityShiftRequest from './reject-security-shift-request';

function getFormattedTimeOnly(isoString) {
  return safeMoment.iso8601Parse(isoString).format(utils.commonDateFormatTimeOnly());
}

function getFormattedDate(startsAt, endsAt) {
  return utils.intervalRotaDatesFormat(safeMoment.iso8601Parse(startsAt), safeMoment.iso8601Parse(endsAt));
}

class SecurityShiftRequestItem extends Component {
  state = {
    isSending: false,
  };

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
    const startsAtDate = safeMoment.iso8601Parse(startsAt).format(utils.commonDateFormat);

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

  onButtonClick = action => {
    this.setState({ isSending: true });
    return action().catch(() => {
      this.setState({ isSending: false });
    });
  };

  handleEditRequest = (hideModal, values) => {
    const editSecurityShiftRequest = oFetch(this.props, 'editSecurityShiftRequest');
    return editSecurityShiftRequest(values).then(response => {
      hideModal();
    });
  };

  handleRejectRequest = (hideModal, values) => {
    const rejectSecurityShiftRequest = oFetch(this.props, 'rejectSecurityShiftRequest');

    return rejectSecurityShiftRequest(values).then(response => {
      hideModal();
    });
  };

  handleOpenEditSecurityShiftRequest = editRequestFormInitialValues => {
    openContentModal({
      submit: this.handleEditRequest,
      config: { title: 'Edit Shift Request' },
      props: { editRequestFormInitialValues },
    })(EditSecurityShiftRequest);
  };

  handleOpenRejectSecurityShiftRequest = rejectRequestFormInitialValues => {
    openContentModal({
      submit: this.handleRejectRequest,
      config: { title: 'Reject Shift Request' },
      props: { rejectRequestFormInitialValues },
    })(RejectSecurityShiftRequest);
  };

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
    const id = oFetch(securityShiftRequest, 'id');
    const startsAt = oFetch(securityShiftRequest, 'startsAt');
    const endsAt = oFetch(securityShiftRequest, 'endsAt');
    const status = oFetch(securityShiftRequest, 'status');
    const venueId = oFetch(securityShiftRequest, 'venueId');
    const createdShift = oFetch(securityShiftRequest, 'createdShift');
    const isAcceptable = oFetch(securityShiftRequest, 'permissions.isAcceptable');
    const isEditable = oFetch(securityShiftRequest, 'permissions.isEditable');
    const isRejectable = oFetch(securityShiftRequest, 'permissions.isRejectable');
    const isUndoable = oFetch(securityShiftRequest, 'permissions.isUndoable');
    const note = oFetch(securityShiftRequest, 'note');
    const rejectReason = oFetch(securityShiftRequest, 'rejectReason');
    const isStartsAtChanged = createdShift && this.chekIfStartsAtChanged(createdShift, startsAt);

    const isEndsAtChanged = createdShift && this.chekIfEndsAtChanged(createdShift, endsAt);
    const isEdited = createdShift && (isStartsAtChanged || isEndsAtChanged);
    const isEditedClass = isEdited ? 'boss-table__row_state_edited' : '';

    const { isCompleted, undoSecurityShiftRequest, acceptSecurityShiftRequest } = this.props;

    const statusClassName =
      status === 'assigned'
        ? 'boss-table__text_role_status'
        : status === 'accepted'
          ? 'boss-table__text_role_success-status'
          : 'boss-table__text_role_alert-status';
    const shiftMinutes = utils.getDiffFromRotaDayInMinutes(
      safeMoment.iso8601Parse(startsAt),
      safeMoment.iso8601Parse(endsAt),
    );
    const editRequestFormInitialValues = {
      startsAt: oFetch(shiftMinutes, 'startMinutes'),
      endsAt: oFetch(shiftMinutes, 'endMinutes'),
      venueId,
      note,
      date: utils.getBuisnessDay(safeMoment.iso8601Parse(startsAt)),
      id,
    };

    const rejectRequestFormInitialValues = {
      id,
      venueId,
    };
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
        {isCompleted ? (
          <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">Status</p>
              <div className="boss-table__info-group">
                <p style={{ textTransform: 'capitalize' }} className={`boss-table__text ${statusClassName}`}>
                  {status}
                </p>
                {isUndoable && (
                  <div className="boss-table__actions">
                    <AsyncButton
                      text="Undo"
                      pendingText="Undoing ..."
                      onClick={() => undoSecurityShiftRequest({ id })}
                      className="boss-button boss-button_type_extra-small boss-button_role_cancel-light boss-table__action"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">Actions</p>
              <div className="boss-table__actions">
                {isAcceptable && (
                  <AsyncButton
                    disabled={this.state.isSending}
                    text="Acccept"
                    pendingText="Acccepting ..."
                    onClick={() => this.onButtonClick(() => acceptSecurityShiftRequest({ id }))}
                    type="button"
                    className="boss-button boss-button_role_accept boss-button_type_extra-small boss-table__action"
                  />
                )}
                {isEditable && (
                  <button
                    disabled={this.state.isSending}
                    onClick={() => this.handleOpenEditSecurityShiftRequest(editRequestFormInitialValues)}
                    type="button"
                    className="boss-button boss-button_role_edit boss-button_type_extra-small boss-table__action"
                  >
                    Edit
                  </button>
                )}
                {isRejectable && (
                  <button
                    disabled={this.state.isSending}
                    onClick={() => this.handleOpenRejectSecurityShiftRequest(rejectRequestFormInitialValues)}
                    type="button"
                    className="boss-button boss-button_role_cancel-light boss-button_type_extra-small boss-table__action"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

SecurityShiftRequestItem.propTypes = {
  securityShiftRequest: PropTypes.shape({
    id: PropTypes.number.isRequired,
    startsAt: PropTypes.string.isRequired,
    endsAt: PropTypes.string.isRequired,
    note: PropTypes.string,
    status: PropTypes.string.isRequired,
    rotaShiftId: PropTypes.number,
    venueId: PropTypes.number.isRequired,
  }),
  isCompleted: PropTypes.bool,
  editSecurityShiftRequest: PropTypes.func,
  rejectSecurityShiftRequest: PropTypes.func,
  undoSecurityShiftRequest: PropTypes.func,
  acceptSecurityShiftRequest: PropTypes.func,
};

export default SecurityShiftRequestItem;
