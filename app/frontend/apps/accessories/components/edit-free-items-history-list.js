import React from 'react';
import oFetch from 'o-fetch';

class EditFreeItemsHistory extends React.Component {
  renderItems(accessoryHistory) {
    const itemRenderer = oFetch(this.props, 'itemRenderer');

    return accessoryHistory.map(historyItem => {
      const historyItemId = oFetch(historyItem, 'id');

      return React.cloneElement(itemRenderer(historyItem), {
        key: historyItemId.toString(),
      });
    });
  }

  render() {
    const accessoryHistory = oFetch(this.props, 'accessoryHistory');
    return (
      <div>
        <div className="boss-modal-window__timeline">
          <div className="boss-timeline">
            <ul className="boss-timeline__list">
              {this.renderItems(accessoryHistory)}
            </ul>
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
