import React from 'react';

class ProfileHistory extends React.Component {
  render() {
    return (
      <section className="boss-board">
        <header className="boss-board__header">
          <h2 className="boss-board__title">History</h2>
        </header>
        <div className="boss-board__main">
          <div className="boss-board__manager">
            <div className="boss-board__manager-group boss-board__manager-group_role_data">{this.props.children}</div>
          </div>
        </div>
      </section>
    );
  }
}

export default ProfileHistory;
