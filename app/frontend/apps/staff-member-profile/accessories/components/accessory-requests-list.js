import React from 'react';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';

class AccessoryRequestsList extends React.Component {
  renderAccessoryRequestItems(accessoryRequests) {
    return accessoryRequests
      .slice()
      .sort((a, b) => {
        const timelineA = oFetch(a, 'timeline');
        const timelineB = oFetch(b, 'timeline');
        const aDate = safeMoment.iso8601Parse(oFetch(timelineA[timelineA.length - 1], 'createdAt'));
        const bDate = safeMoment.iso8601Parse(oFetch(timelineB[timelineB.length - 1], 'createdAt'));

        return bDate - aDate;
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
