import React, { Component } from 'react';
import oFetch from 'o-fetch';

export default class StaffMembersList extends Component {
  renderList = () => {
    const [items, itemRenderer] = oFetch(this.props, 'items', 'itemRenderer');
    return items.map((item, index) => {
      return React.cloneElement(itemRenderer(item), {
        key: index,
      });
    });
  };

  render() {
    return <div className="boss-users__flow-list">{this.renderList()}</div>;
  }
}
