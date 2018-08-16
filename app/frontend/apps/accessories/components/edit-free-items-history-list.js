import React from 'react';
import oFetch from 'o-fetch';

class EditFreeItemsHistory extends React.Component {
  renderItems(accessoryHistory) {
    const itemRenderer = oFetch(this.props, 'itemRenderer');

    return accessoryHistory.map((historyItem, index) => {
      const previouseItem = accessoryHistory[index - 1];
      const previousCount = previouseItem ? previouseItem.count : 0;

      return React.cloneElement(itemRenderer(historyItem, previousCount), {
        key: index.toString(),
      });
    });
  }

  render() {
    const accessoryHistory = oFetch(this.props, 'accessoryHistory');
    return (
      <div>
        <div className="boss-modal-window__timeline">
          <div className="boss-timeline">
            {accessoryHistory.length > 0 ? (
              <ul className="boss-timeline__list">{this.renderItems(accessoryHistory)}</ul>
            ) : (
              <h1>No history</h1>
            )}
          </div>
        </div>
        <div className="boss-modal-window__actions">
          <button onClick={this.props.onClose} type="button" className="boss-button">
            Back To Form
          </button>
        </div>
      </div>
    );
  }
}

export default EditFreeItemsHistory;
