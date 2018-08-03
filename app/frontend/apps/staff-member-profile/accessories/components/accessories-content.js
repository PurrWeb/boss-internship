import React from 'react';
import oFetch from 'o-fetch';

class AccessoriesContent extends React.PureComponent {
  render() {
    const children = oFetch(this.props, 'children');
    return (
      <div className="boss-board__main">
        <div className="boss-board__manager">
          <div className="boss-board__manager-group boss-board__manager-group_role_data">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default AccessoriesContent;
