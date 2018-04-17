import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import moment from 'moment';
import { openContentModal } from '~/components/modals';
import RejectSecurityShiftRequest from './reject-security-shift-request';


class SecurityRotaShiftRequestsItem extends Component {
  handleOpenRejectSecurityShiftRequest = rejectRequestFormInitialValues => {
    openContentModal({
      submit: this.handleRejectRequest,
      config: { title: 'Reject Shift Request' },
      props: { rejectRequestFormInitialValues },
    })(RejectSecurityShiftRequest);
  };

  handleRejectRequest = (hideModal, values) => {
    const rejectSecurityShiftRequest = oFetch(
      this.props,
      'rejectSecurityShiftRequest',
    );
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        rejectSecurityShiftRequest(values);
        resolve();
        hideModal();
      }, 1000);
    });
  };

  render() {
    const shiftRequest = oFetch(this.props, 'shiftRequest');
    const startsAt = oFetch(shiftRequest, 'startsAt');
    const endsAt = oFetch(shiftRequest, 'endsAt');
    const venueName = oFetch(shiftRequest, 'venueName');
    const id = oFetch(shiftRequest, 'id');
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
              {`${moment(startsAt).format(
              'HH:mm',
            )} - ${moment(endsAt).format('HH:mm ddd DD/MM/YYYY')}`}
            </h3>
            <div className="boss-check__header-meta">
              <div className="boss-check__header-meta-item">
                <p className="boss-check__text boss-check__text_role_main boss-check__text_role_venue">
                  {venueName}
                </p>
              </div>
            </div>
          </div>
          <div className="boss-check__header-actions">
            <button
              type="button"
              className="boss-button boss-button_role_confirm boss-button_type_small boss-check__header-action"
            >
              Assign
            </button>
            <button
            onClick={() =>
                    this.handleOpenRejectSecurityShiftRequest(
                      rejectRequestFormInitialValues,
                    )
                  }
              type="button"
              className="boss-button boss-button_role_cancel boss-button_type_small boss-check__header-action"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  }
}

SecurityRotaShiftRequestsItem.propTypes = {
  shiftRequest: PropTypes.shape({
    startsAt: PropTypes.string.isRequired,
    endsAt: PropTypes.string.isRequired,
    shiftType: PropTypes.string.isRequired,
    note: PropTypes.string,
    status: PropTypes.string.isRequired,
    rotaShiftId: PropTypes.number,
    venueId: PropTypes.number.isRequired,
    venueName: PropTypes.string.isRequired,
  }),
  rejectSecurityShiftRequest: PropTypes.func.isRequired,
};

export default SecurityRotaShiftRequestsItem;
