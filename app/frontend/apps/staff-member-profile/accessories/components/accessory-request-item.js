import React from 'react';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';
import * as constants from './constants';

class AccessoryRequestItem extends React.Component {
  renderRequestActions(accessoryRequest) {
    const accessoryRequestId = oFetch(accessoryRequest, 'id');
    const status = oFetch(accessoryRequest, 'status');
    const hasRefundRequest = oFetch(accessoryRequest, 'hasRefundRequest');

    if (status === constants.ACCESSORY_REQUEST_STATUS_ACCEPTED) {
      return (
        <div className="boss-requests__actions">
          {!hasRefundRequest && (
            <button
              onClick={() => this.props.onAccessoryRefund(accessoryRequestId)}
              className={`boss-requests__action boss-requests__action_role_request`}
            >
              Request refund
            </button>
          )}
        </div>
      );
    }
    if (status === constants.ACCESSORY_REQUEST_STATUS_PENDING) {
      return (
        <div className="boss-requests__actions">
          <button
            className={`boss-requests__action boss-requests__action_role_cancel`}
            onClick={() => this.props.onAccessoryCancel(accessoryRequestId)}
          >
            Cancel
          </button>
        </div>
      );
    }
    return null;
  }

  render() {
    const { accessoryRequest } = this.props;
    const requestDate = safeMoment
      .iso8601Parse(oFetch(accessoryRequest, 'createdAt'))
      .format(utils.humanDateFormatWithTime());
    const status = oFetch(accessoryRequest, 'status');
    const accessoryName = oFetch(accessoryRequest, 'accessoryName');
    const size = oFetch(accessoryRequest, 'size');
    const hasRefundRequest = oFetch(accessoryRequest, 'hasRefundRequest');
    const requestStatus = hasRefundRequest ? 'requested' : status;
    const statusClassPrefix =
      requestStatus === constants.ACCESSORY_REQUEST_STATUS_CANCELED
        ? 'rejected'
        : requestStatus;

    return (
      <li className="boss-requests__item">
        <div className="boss-requests__meta">
          <div className="boss-requests__date">{requestDate}</div>
          <div
            className={`boss-requests__status boss-requests__status_role_${statusClassPrefix}`}
          >
            {constants.ACCESSORY_REQUEST_STATUS[requestStatus]}
          </div>
        </div>
        <div className="boss-requests__content">
          <div className="boss-requests__header">
            <h3 className="boss-requests__title">
              <span className="boss-requests__title-name">
                {accessoryName}
              </span>
              <span className="boss-requests__title-size">
                {size ? `(${size})` : '(N/A)'}
              </span>
            </h3>
            {this.renderRequestActions(accessoryRequest)}
          </div>
        </div>
      </li>
    );
  }
}

export default AccessoryRequestItem;
