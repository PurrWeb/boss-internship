import React, { Component } from 'react';
import oFetch from 'o-fetch';

export default class GroupWrapper extends Component {
  render() {
    const [groupTitle, children] = oFetch(this.props, 'groupTitle', 'children');
    return (
      <div className="boss-users__group">
        <div className="boss-users__group-header">
          <h3 className="boss-users__group-title">{groupTitle}</h3>
        </div>
        <div className="boss-users__group-content boss-users__group-content_adjust_flow">{children}</div>
      </div>
    );
  }
}
