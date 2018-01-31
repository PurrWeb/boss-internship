import React from 'react';
import AccessoryRequestItem from './accessory-request-item';

class AccessoryRequestsList extends React.Component {
  renderAccessoryRequestItems(accessoryRequests) {
    return accessoryRequests.map((item, index) => {
      return (
        <AccessoryRequestItem
          onAccessoryRefund={this.props.onAccessoryRefund}
          onAccessoryCancel={this.props.onAccessoryCancel}
          accessoryRequest={item}
          key={index}
        />
      );
    });
  }

  render() {
    return (
      <ul className="boss-requests__list">
        {this.renderAccessoryRequestItems(this.props.accessoryRequests)}
      </ul>
    );
  }
}

export default AccessoryRequestsList;
