import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';
import { openContentModal, openInfoModal } from '~/components/modals';
import safeMoment from '~/lib/safe-moment';
import RejectSecurityShiftRequest from './reject-security-shift-request';

class RequestsItem extends PureComponent {
  handleOpenRejectSecurityShiftRequest = rejectRequestFormInitialValues => {
    openContentModal({
      submit: this.handleRejectRequest,
      config: { title: 'Reject Shift Request' },
      props: { rejectRequestFormInitialValues },
    })(RejectSecurityShiftRequest);
  };

  handleRejectRequest = (hideModal, values) => {
    const rejectSecurityShiftRequest = oFetch(this.props, 'rejectSecurityShiftRequest');
    return rejectSecurityShiftRequest(values).then(response => {
      hideModal();
    });
  };

  handleOpenNoteModal = note => {
    openInfoModal({
      config: { title: 'Note', text: note },
    });
  };

  render() {
    const shiftRequest = oFetch(this.props, 'shiftRequest');
    const isAssignable = oFetch(shiftRequest, 'permissions.isAssignable');
    const isRejectable = oFetch(shiftRequest, 'permissions.isRejectable');
    const onOpenAssignPage = oFetch(this.props, 'onOpenAssignPage');
    const startsAt = oFetch(shiftRequest, 'startsAt');
    const endsAt = oFetch(shiftRequest, 'endsAt');
    const venueName = oFetch(shiftRequest, 'venueName');
    const id = oFetch(shiftRequest, 'id');
    const note = oFetch(shiftRequest, 'note');
    const venueId = oFetch(shiftRequest, 'venueId');

    const rejectRequestFormInitialValues = {
      id,
      venueId,
    };

    return (
      <div className="boss-check boss-check_role_panel boss-check_page_ssr-requests">
        <div className="boss-check__header">
          <div className="boss-check__header-group">
            <h3 className="boss-check__title boss-check__title_role_time">
              {utils.intervalRotaDatesFormat(safeMoment.iso8601Parse(startsAt), safeMoment.iso8601Parse(endsAt))}
            </h3>
            <div className="boss-check__header-meta">
              <div className="boss-check__header-meta-item">
                <p className="boss-check__text boss-check__text_role_main boss-check__text_role_venue">{venueName}</p>
              </div>
              {note && (
                <div className="boss-check__header-meta-item">
                  <p
                    onClick={() => this.handleOpenNoteModal(note)}
                    className="boss-check__text boss-check__text_role_main boss-check__text_role_note boss-check__text_role_link"
                  >
                    Show Note
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="boss-check__header-actions">
            {isAssignable && (
              <button
                onClick={() => onOpenAssignPage(shiftRequest)}
                type="button"
                className="boss-button boss-button_role_confirm boss-button_type_small boss-check__header-action"
              >
                Assign
              </button>
            )}
            {isRejectable && (
              <button
                onClick={() => this.handleOpenRejectSecurityShiftRequest(rejectRequestFormInitialValues)}
                type="button"
                className="boss-button boss-button_role_cancel boss-button_type_small boss-check__header-action"
              >
                Reject
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

RequestsItem.propTypes = {
  shiftRequest: PropTypes.shape({
    startsAt: PropTypes.string.isRequired,
    endsAt: PropTypes.string.isRequired,
    note: PropTypes.string,
    status: PropTypes.string.isRequired,
    rotaShiftId: PropTypes.number,
    venueId: PropTypes.number.isRequired,
    venueName: PropTypes.string.isRequired,
  }),
  rejectSecurityShiftRequest: PropTypes.func.isRequired,
};

export default RequestsItem;
