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
    processing: false,
  };

  setProcessingState = (args, action) => {
    this.setState({ processing: true }, () => {
      action(args)
        .then(() => {
          this.setState({ processing: false });
        })
        .catch(() => {
          this.setState({ processing: false });
        });
    });
  };

  renderRequestActions(accessoryRequest) {
    const accessoryRequestId = oFetch(accessoryRequest, 'id');
    const status = oFetch(accessoryRequest, 'status');
    const hasRefundRequest = oFetch(accessoryRequest, 'hasRefundRequest');
    const refundRequestStatus = oFetch(accessoryRequest, 'refundRequestStatus');

    const onAccessoryRefund = oFetch(this.props, 'onAccessoryRefund');
    const onAccessoryCancel = oFetch(this.props, 'onAccessoryCancel');
    const accessoryRequestPermissions = oFetch(this.props, 'accessoryRequestPermissions');
    const [isCancelable, isRefundable] = oFetch(accessoryRequestPermissions, 'isCancelable', 'isRefundable');

    const refundRequestStatusRejected = refundRequestStatus === 'rejected';
    if (status === constants.ACCESSORY_REQUEST_STATUS_COMPLETED) {
      return (
        <div className="boss-requests__actions">
          {(!hasRefundRequest || refundRequestStatusRejected) &&
            isRefundable && (
              <button
                onClick={() => this.setProcessingState(accessoryRequestId, this.props.onAccessoryRefund)}
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
          {isCancelable && (
            <button
              className={`boss-requests__action boss-requests__action_role_cancel`}
              onClick={() => this.setProcessingState(accessoryRequestId, this.props.onAccessoryCancel)}
            >
              Cancel
            </button>
          )}
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
      const date = safeMoment.iso8601Parse(oFetch(timelineItem, 'createdAt')).format(utils.humanDateFormatWithTime());
      const requestType = oFetch(timelineItem, 'requestType');
      const requestAction = oFetch(timelineItem, 'state') === 'pending' ? 'Requested' : oFetch(timelineItem, 'state');
      const fullName = oFetch(timelineItem, 'requester.fullName');
      return (
        <div key={`${key}`} className="boss-requests__details-record">
          <p className="boss-requests__details-text">
            {requestType === 'refundRequest' ? `Refund ${humanize(requestAction)}` : humanize(requestAction)}
            {` on ${date} by ${fullName}`}
            <span className="boss-requests__details-text-marked" />
          </p>
        </div>
      );
    });
  };

  handleEditPayslipDate = () => {
    const [onEditPayslipDate, accessoryRequest] = oFetch(this.props, 'onEditPayslipDate', 'accessoryRequest');
    return onEditPayslipDate(accessoryRequest);
  };

  handleEditRefundPayslipDate = () => {
    const [onEditRefundPayslipDate, accessoryRequest] = oFetch(
      this.props,
      'onEditRefundPayslipDate',
      'accessoryRequest',
    );
    return onEditRefundPayslipDate(accessoryRequest);
  };

  render() {
    const accessoryRequest = oFetch(this.props, 'accessoryRequest');
    const timeline = oFetch(accessoryRequest, 'timeline');
    const requestDate = safeMoment
      .iso8601Parse(oFetch(timeline[timeline.length - 1], 'createdAt'))
      .format(utils.humanDateFormatWithTime());
    const status = oFetch(accessoryRequest, 'status');
    const accessoryName = oFetch(accessoryRequest, 'accessoryName');
    const size = oFetch(accessoryRequest, 'size');
    const hasRefundRequest = oFetch(accessoryRequest, 'hasRefundRequest');
    const refundRequestStatus = oFetch(accessoryRequest, 'refundRequestStatus');
    const refundStatusClassPrefix = REFUND_REQUEST_STATUS_CLASS_PREFIXES[refundRequestStatus];
    const requestStatusClassPrefix = REQUEST_STATUS_CLASS_PREFIXES[status];
    const statusClassPrefix = hasRefundRequest ? refundStatusClassPrefix : requestStatusClassPrefix;
    const requestFrozen = oFetch(accessoryRequest, 'requestFrozen');
    const sPayslipDate = oFetch(accessoryRequest, 'payslipDate');
    const sPayslipDateText = sPayslipDate ? safeMoment.uiDateParse(sPayslipDate).format(utils.commonDateFormat) : null;
    const refundFrozen = oFetch(accessoryRequest, 'refundFrozen');
    const sRefundPayslipDate = oFetch(accessoryRequest, 'refundPayslipDate');
    const sRefundPayslipDateText = sRefundPayslipDate
      ? safeMoment.uiDateParse(sRefundPayslipDate).format(utils.commonDateFormat)
      : null;
    return (
      <li className="boss-requests__item">
        <div className="boss-requests__meta">
          <div className="boss-requests__date">{requestDate}</div>
          {!this.state.processing && (
            <div className={`boss-requests__status boss-requests__status_role_${statusClassPrefix}`}>
              {hasRefundRequest
                ? REFUND_REQUEST_STATUSES[refundRequestStatus]
                : constants.ACCESSORY_REQUEST_STATUS[status]}
            </div>
          )}
          {this.state.processing && (
            <div className={`boss-requests__status boss-requests__status_role_${statusClassPrefix}`}>
              Processing ...
            </div>
          )}
        </div>
        {!this.state.processing && (
          <div className="boss-requests__content">
            <div className="boss-requests__header">
              <h3 className="boss-requests__title">
                <span className="boss-requests__title-name">{accessoryName}</span>
                <span className="boss-requests__title-size">{size ? `(${size})` : '(N/A)'}</span>
              </h3>
              {this.renderRequestActions(accessoryRequest)}
            </div>
            {sPayslipDateText && (
              <div className="boss-requests__details">
                <div className="boss-requests__details-content">
                  <div className="boss-requests__details-line">
                    <div className="boss-requests__details-value">
                      <p
                        className={`boss-request__details-text ${
                          requestFrozen ? 'boss-requests__details-text_indicator_frozen' : ''
                        }`}
                      >
                        Payslip Date: <span className="boss-requests__details-text-marked">{sPayslipDateText}</span>
                      </p>
                    </div>
                    {!requestFrozen && (
                      <div className="boss-requests__actions" onClick={this.handleEditPayslipDate}>
                        <p className="boss-requests__action boss-requests__action_role_edit">Edit</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {sRefundPayslipDateText && (
              <div className="boss-requests__details">
                <div className="boss-requests__details-content">
                  <div className="boss-requests__details-line">
                    <div className="boss-requests__details-value">
                      <p
                        className={`boss-request__details-text ${
                          refundFrozen ? 'boss-requests__details-text_indicator_frozen' : ''
                        }`}
                      >
                        Refund Payslip Date:{' '}
                        <span className="boss-requests__details-text-marked">{sRefundPayslipDateText}</span>
                      </p>
                    </div>
                    {!refundFrozen && (
                      <div className="boss-requests__actions" onClick={this.handleEditRefundPayslipDate}>
                        <p className="boss-requests__action boss-requests__action_role_edit">Edit</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
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
                <div className="boss-requests__details-content">{this.renderTimeline(accessoryRequest)}</div>
              </Collapse>
            </div>
          </div>
        )}
      </li>
    );
  }
}

export default AccessoryRequestItem;
