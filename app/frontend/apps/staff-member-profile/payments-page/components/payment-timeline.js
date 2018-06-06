import React from 'react';
import oFetch from 'o-fetch';
import safeMoment from "~/lib/safe-moment";
import utils from '~/lib/utils';
import numeral from 'numeral';
import {
  PENDING_PAYMENT_STATUS,
  RECEIVED_PAYMENT_STATUS
} from '../constants';

export class PaymentTimeline extends React.Component {
  getStatusClass(statusEnum) {
    switch(statusEnum) {
      case PENDING_PAYMENT_STATUS:
        return 'boss-indicator_status_uncollected';
      case RECEIVED_PAYMENT_STATUS:
        return 'boss-indicator_status_collected'
      default:
        throw new Error(`unsupported status supplied: ${statusEnum}`);
    }
  }

  getMarkerClass(statusEnum) {
    switch(statusEnum) {
      case PENDING_PAYMENT_STATUS:
        return 'boss-indicator__marker_icon_hour-glass';
      case RECEIVED_PAYMENT_STATUS:
        return 'boss-indicator__marker_icon_check';
      default:
        throw new Error(`unsupported status supplied: ${statusEnum}`);
    }
  }

  getStatusDescription(statusEnum) {
    switch(statusEnum) {
      case PENDING_PAYMENT_STATUS:
        return 'Uncollected';
      case RECEIVED_PAYMENT_STATUS:
        return 'Collected';
      default:
        throw new Error(`unsupported status supplied: ${statusEnum}`);
    }
  }

  renderPaymentTimeLineItem(params) {
    const payment = oFetch(params, 'payment');
    const paymentId = oFetch(payment, 'id');
    const cents = oFetch(payment, 'cents');
    const sDate = oFetch(payment, 'processDate');
    const mDate = safeMoment.uiDateParse(sDate);
    const amount = numeral(cents / 100.0).format('0,0.00');
    const mWeekStartDate = safeMoment.uiDateParse(oFetch(payment, 'weekStartDate'));
    const mWeekEndDate = safeMoment.uiDateParse(oFetch(payment, 'weekEndDate'));
    const statusEnum = oFetch(payment, 'status');
    const statusDescription = this.getStatusDescription(statusEnum);
    const statusClass = this.getStatusClass(statusEnum);
    const markerClass = this.getMarkerClass(statusEnum);
    const slashDateFormat = oFetch(utils, 'slashDateFormat');
    const isLate = oFetch(payment, 'isLate');
    const isLateListItemClass = isLate ? 'boss-timeline__item_state_alert' : '';
    const isLateListInnerStateClass = isLate ? 'boss-timeline__inner_state_alert' : '';
    const receivedAt = payment.receivedAt;
    const mRecievedAt = receivedAt ? safeMoment.iso8601Parse(receivedAt) : null;

    return <li key={ `timelineItem:${paymentId}` } className={ `boss-timeline__item boss-timeline__item_role_card ${isLateListItemClass}` } >
      <div className={ `boss-timeline__inner boss-timeline__inner_role_card ${isLateListInnerStateClass}` }>
        <div className="boss-timeline__header boss-timeline__header_role_card">
          <h3 className="boss-timeline__title">
            <span className="boss-timeline__title-primary">{ mWeekStartDate.format(slashDateFormat) } - { mWeekEndDate.format(slashDateFormat) }</span>
            <span className="boss-timeline__title-secondary">£{ amount }</span>
          </h3>
          <div className="boss-timeline__indicator">
            <div className={`boss-indicator ${statusClass} boss-indicator_position_after`}>
              <span className="boss-indicator__label boss-indicator__label_position_before boss-indicator__label_state_hidden-s">{ statusDescription }</span>
              <span className={ `boss-indicator__marker ${markerClass}` }></span>
            </div>
          </div>
        </div>
        { (statusEnum === RECEIVED_PAYMENT_STATUS) && <div className="boss-timeline__content boss-timeline__content_role_card">
          <p className="boss-timeline__text">
            <span className="boss-timeline__text-marked">Collected </span>
            <span className="boss-timeline__text-faded">on </span>
            <span className="boss-timeline__text-marked">{ mRecievedAt.format(oFetch(utils, 'humanDateFormatWithTime')()) }</span>
          </p>
        </div> }
      </div>
    </li>;
  }

  render() {
    const payments = oFetch(this.props, 'payments');
    const paymentCount = oFetch(payments, 'length');

    return <div className="boss-board__manager-timeline">
      <div className="boss-timeline boss-timeline_role_payments">
        { (paymentCount <= 0) && <div>No Payments Found</div> }
        { (paymentCount > 0) &&
          <ul className="boss-timeline__list">
            { payments.map((payment) => {
                return this.renderPaymentTimeLineItem({
                  payment: payment
                })
              })  }
          </ul> }
      </div>
    </div>;
  }
}
