import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';

class ProfileHistoryList extends React.Component {
  renderItems(historyList) {
    const itemRenderer = oFetch(this.props, 'itemRenderer');

    return historyList.map(historyItem =>
      React.cloneElement(itemRenderer(historyItem), {
        key: historyItem.date.toString(),
      }),
    );
  }
  render() {
    const [historyList, onLoadMore, total] = oFetch(this.props, 'historyList', 'onLoadMore', 'total');
    return (
      <div>
        <div className="boss-board__manager-timeline">
          <div className="boss-timeline boss-timeline_role_payments">
            <ul className="boss-timeline__list">{this.renderItems(historyList)}</ul>
          </div>
        </div>
        {historyList.length !== total && (
          <div className="boss-board__manager-actions">
            <button
              onClick={onLoadMore}
              className="boss-button boss-button_role_load-more boss-button_adjust_full-mobile"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    );
  }
}

ProfileHistoryList.propTypes = {
  itemRenderer: PropTypes.func.isRequired,
  historyList: PropTypes.array.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

export default ProfileHistoryList;
