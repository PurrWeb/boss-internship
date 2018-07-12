import React from 'react';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';

class EditFreeItemsHistory extends React.Component {
  render() {
    const historyItem = oFetch(this.props, 'historyItem');
    const count = oFetch(historyItem, 'count');
    const fullName = oFetch(historyItem, 'fullName');
    const time = safeMoment.iso8601Parse(oFetch(historyItem, 'time')).format(utils.humanDateFormatWithTime());
    const isCountNegative = count < 0;

    return (
      <li className="boss-timeline__item boss-timeline__item_adjust_count">
        <div className={`boss-timeline__count ${isCountNegative && 'boss-timeline__count_state_alert'}`}>{count}</div>
        <div className="boss-timeline__inner boss-timeline__inner_adjust_count">
          <div className="boss-timeline__header boss-timeline__header_adjust_count">
            <p className="boss-timeline__text boss-timeline__text_role_header">
              <span className="boss-timeline__text-marked">{fullName}</span>
              <span className="boss-timeline__text-faded"> on </span>
              <span className="boss-timeline__text-marked">{time}</span>
            </p>
          </div>
        </div>
      </li>
    );
  }
}

export default EditFreeItemsHistory;
