import React from 'react';

class AccessoriesContent extends React.PureComponent {
  render() {
    return (
      <div className="boss-board__main">
        <div className="boss-board__manager">
          <div className="boss-board__manager-requests">
            <div className="boss-requests">
              { this.props.children }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AccessoriesContent;
