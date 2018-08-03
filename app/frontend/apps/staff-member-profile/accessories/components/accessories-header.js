import React from 'react';
import oFetch from 'o-fetch';

class AccessoriesHeader extends React.Component {
  render() {
    const canCreateAccessoryRequest = oFetch(this.props, 'canCreateAccessoryRequest');
    const title = oFetch(this.props, 'title');
    const onRequest = oFetch(this.props, 'onRequest');
    return (
      <header className="boss-board__header">
        <h2 className="boss-board__title">{title}</h2>
        <div className="boss-board__button-group">
          {canCreateAccessoryRequest && (
            <button onClick={onRequest} className="boss-button boss-button_role_add">
              Add Request
            </button>
          )}
        </div>
      </header>
    );
  }
}

export default AccessoriesHeader;
