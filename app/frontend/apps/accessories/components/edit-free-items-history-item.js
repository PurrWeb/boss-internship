import React from 'react';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';

class EditFreeItemsHistory extends React.Component {
  renderAssignedItem(historyItem) {
    const fullName = oFetch(historyItem, 'createdByUser');
    const time = safeMoment.iso8601Parse(oFetch(historyItem, 'createdAt')).format(utils.humanDateFormatWithTime());
    const assignedTo = oFetch(historyItem, 'assignedTo');
    const delta = oFetch(historyItem, 'delta');
    const amountOfItems = Math.abs(delta);

    return (
      <p className="boss-timeline__text boss-timeline__text_role_header">
        <span className="boss-timeline__text-marked">{amountOfItems}</span>
        <span className="boss-timeline__text-faded"> item assigned to </span>
        <span className="boss-timeline__text-marked">{assignedTo}</span>
        <span className="boss-timeline__text-faded"> by </span>
        <span className="boss-timeline__text-marked">{fullName}</span>
        <span className="boss-timeline__text-faded"> at </span>
        <span className="boss-timeline__text-marked">{time}</span>
      </p>
    );
  }

  renderRestockItem(historyItem, itemAction) {
    const fullName = oFetch(historyItem, 'createdByUser');
    const time = safeMoment.iso8601Parse(oFetch(historyItem, 'createdAt')).format(utils.humanDateFormatWithTime());
    const delta = oFetch(historyItem, 'delta');
    const amountOfItems = Math.abs(delta);

    return (
      <p className="boss-timeline__text boss-timeline__text_role_header">
        <span className="boss-timeline__text-marked">{amountOfItems}</span>
        <span className="boss-timeline__text-faded"> items {itemAction} by </span>
        <span className="boss-timeline__text-marked">{fullName}</span>
        <span className="boss-timeline__text-faded"> at </span>
        <span className="boss-timeline__text-marked">{time}</span>
      </p>
    );
  }

  render() {
    const historyItem = oFetch(this.props, 'historyItem');
    const previousCount = oFetch(this.props, 'previousCount');
    const count = oFetch(historyItem, 'count');
    const isCountNegative = count < 0;
    const assignedTo = oFetch(historyItem, 'assignedTo');
    const isAssignedItem = !!assignedTo;
    const itemAction = previousCount < count ? 'added' : 'removed';

    return (
      <li className="boss-timeline__item boss-timeline__item_adjust_count">
        <div className={`boss-timeline__count ${isCountNegative && 'boss-timeline__count_state_alert'}`}>{count}</div>
        <div className="boss-timeline__inner boss-timeline__inner_adjust_count">
          <div className="boss-timeline__header boss-timeline__header_adjust_count">
            {isAssignedItem ? this.renderAssignedItem(historyItem) : this.renderRestockItem(historyItem, itemAction)}
          </div>
        </div>
      </li>
    );
  }
}

export default EditFreeItemsHistory;
