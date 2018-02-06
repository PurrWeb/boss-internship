import React from 'react';
import oFetch from 'o-fetch';
import { Collapse } from 'react-collapse';
import humanize from 'string-humanize';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';
import * as constants from './constants';

const REFUND_REQUEST_STATUSES = {
  pending: 'Refund Requested',
  accepted: 'Refund accepted',
  rejected: 'Refund rejected',
  completed: 'Refund completed',
};

const REQUEST_STATUS_CLASS_PREFIXES = {
  [constants.ACCESSORY_REQUEST_STATUS_ACCEPTED]: 'accepted',
  [constants.ACCESSORY_REQUEST_STATUS_COMPLETED]: 'accepted',
  [constants.ACCESSORY_REQUEST_STATUS_PENDING]: 'pending',
  [constants.ACCESSORY_REQUEST_STATUS_REJECTED]: 'rejected',
  [constants.ACCESSORY_REQUEST_STATUS_CANCELED]: 'rejected',
};

const REFUND_REQUEST_STATUS_CLASS_PREFIXES = {
  pending: 'requested',
  accepted: 'accepted',
  rejected: 'rejected',
  completed: 'accepted',
};

class AccessoryRequestItem extends React.Component {
  state = {
    isRefundsTimelineOpened: false,
  };

  renderRequestActions(accessoryRequest) {
    const accessoryRequestId = oFetch(accessoryRequest, 'id');
    const status = oFetch(accessoryRequest, 'status');
    const hasRefundRequest = oFetch(accessoryRequest, 'hasRefundRequest');
    const refundRequestStatus = oFetch(accessoryRequest, 'refundRequestStatus');
    const refundRequestStatusRejected = refundRequestStatus === 'rejected';
    if (status === constants.ACCESSORY_REQUEST_STATUS_COMPLETED) {
      return (
        <div className="boss-requests__actions">
          {(!hasRefundRequest || refundRequestStatusRejected) && (
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

  toggleRefundTimeline = () => {
    this.setState(state => ({
      isRefundsTimelineOpened: !state.isRefundsTimelineOpened,
    }));
  };

  renderTimeline = accessoryRequest => {
    return accessoryRequest.timeline.map((timelineItem, key) => {
      const date = safeMoment
        .iso8601Parse(oFetch(timelineItem, 'createdAt'))
        .format(utils.humanDateFormatWithTime());
      const requestType = oFetch(timelineItem, 'requestType');
      const requestAction =
        oFetch(timelineItem, 'state') === 'pending' ? 'Requested' : oFetch(timelineItem, 'state');
      const type = oFetch(timelineItem, 'type');
      const fullName = oFetch(timelineItem, 'requester.fullName');
      return (
        <div key={`${key}`} className="boss-requests__details-record">
          <p className="boss-requests__details-text">
            {requestType === 'refundRequest'
              ? `Refund ${humanize(requestAction)}`
              : humanize(requestAction)}
            {` on ${date} ${type === 'response' ? `by ${fullName}` : ''}`}
            <span className="boss-requests__details-text-marked" />
          </p>
        </div>
      );
    });
  };

  render() {
    const { accessoryRequest } = this.props;
    const requestDate = safeMoment
      .iso8601Parse(oFetch(accessoryRequest, 'updatedAt'))
      .format(utils.humanDateFormatWithTime());
    const status = oFetch(accessoryRequest, 'status');
    const accessoryName = oFetch(accessoryRequest, 'accessoryName');
    const size = oFetch(accessoryRequest, 'size');
    const hasRefundRequest = oFetch(accessoryRequest, 'hasRefundRequest');
    const refundRequestStatus = oFetch(accessoryRequest, 'refundRequestStatus');
    const requestFrozen = oFetch(accessoryRequest, 'frozen');
    const refundStatusClassPrefix = REFUND_REQUEST_STATUS_CLASS_PREFIXES[refundRequestStatus];
    const requestStatusClassPrefix = REQUEST_STATUS_CLASS_PREFIXES[status];
    const statusClassPrefix = hasRefundRequest ? refundStatusClassPrefix : requestStatusClassPrefix;
    return (
      <li className="boss-requests__item">
        <div className="boss-requests__meta">
          <div className="boss-requests__date">{requestDate}</div>
          <div className={`boss-requests__status boss-requests__status_role_${statusClassPrefix}`}>
            {hasRefundRequest
              ? REFUND_REQUEST_STATUSES[refundRequestStatus]
              : constants.ACCESSORY_REQUEST_STATUS[status]}
          </div>
        </div>
        <div className="boss-requests__content">
          <div className="boss-requests__header">
            <h3 className="boss-requests__title">
              <span className="boss-requests__title-name">{accessoryName}</span>
              <span className="boss-requests__title-size">{size ? `(${size})` : '(N/A)'}</span>
            </h3>
            {!requestFrozen && this.renderRequestActions(accessoryRequest)}
          </div>
          <div className="boss-requests__details">
            <p
              className={`boss-requests__details-switch ${
                this.state.isRefundsTimelineOpened
                  ? 'boss-requests__details-switch_role_cancel'
                  : 'boss-requests__details-switch_role_list'
              }`}
              onClick={this.toggleRefundTimeline}
            >
              {this.state.isRefundsTimelineOpened ? 'Hide' : 'Show timeline'}
            </p>
            <Collapse
              isOpened={this.state.isRefundsTimelineOpened}
              className="boss-requests__details-dropdown"
              style={{ display: 'block' }}
            >
              <div className="boss-requests__details-content">
                {this.renderTimeline(accessoryRequest)}
              </div>
            </Collapse>
          </div>
        </div>
      </li>
    );
  }
}

export default AccessoryRequestItem;
