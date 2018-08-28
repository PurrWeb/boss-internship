import React from 'react';
import safeMoment from '~/lib/safe-moment';

class AccessoryRequestsList extends React.Component {
  renderAccessoryRequestItems(accessoryRequests) {
    return accessoryRequests
      .slice()
      .sort((a, b) => {
        return safeMoment.iso8601Parse(b.updatedAt) - safeMoment.iso8601Parse(a.updatedAt);
      })
      .map((item, index) => {
        return React.cloneElement(this.props.accessoryRequestRendered(item), {
          key: index,
        });
      });
  }

  render() {
    return (
      <div className="boss-board__manager-requests">
        <div className="boss-requests">
          <ul className="boss-requests__list">{this.renderAccessoryRequestItems(this.props.accessoryRequests)}</ul>
        </div>
      </div>
    );
  }
}

export default AccessoryRequestsList;
