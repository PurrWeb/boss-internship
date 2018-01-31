import React from 'react';
import AccessoryRequestItem from './accessory-request-item';

class AccessoryRequestsList extends React.Component {
  renderAccessoryRequestItems(accessoryRequests) {
    return accessoryRequests.map((item, index) => {
      return <AccessoryRequestItem accessoryRequest={item} key={index} />
    });
  }

  render() {
    return (
      <ul className="boss-requests__list">
        { this.renderAccessoryRequestItems(this.props.accessoryRequests) }
      </ul>
    )
  }
}

export default AccessoryRequestsList;
