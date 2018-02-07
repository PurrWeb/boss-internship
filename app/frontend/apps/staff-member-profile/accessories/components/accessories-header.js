import React from 'react';

class AccessoriesHeader extends React.Component {
  render() {
    return (
      <header className="boss-board__header">
        <h2 className="boss-board__title">
          {this.props.title}
        </h2>
        <div className="boss-board__button-group">
          <button
            onClick={this.props.onRequest}
            className="boss-button boss-button_role_add"
          >Add Request</button>
        </div>
      </header>
    )
  }
}

export default AccessoriesHeader;
